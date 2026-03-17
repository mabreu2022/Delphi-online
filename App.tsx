


import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Editor from 'react-simple-code-editor';
import 'prismjs/components/prism-pascal';
import JSZip from 'jszip';

import { compileDelphiCode, runDelphiCode, formatDelphiCode, analyzeDelphiCode } from './services/geminiService';
import { OutputType, DfmComponent } from './types';
import { 
    HammerIcon, PlayIcon, SpinnerIcon, SaveIcon, FolderOpenIcon, FileIcon, SparklesIcon, TrashIcon, DelphiLogo, DownloadIcon,
    PaletteIcon, InspectorIcon, ButtonIcon, EditIcon, LabelIcon, PanelIcon, CheckboxIcon, AnalyzeIcon,
    DataSourceIcon, MenuIcon, MemoIcon, ComboBoxIcon, RadioGroupIcon, GroupBoxIcon, ImageIcon, StructureIcon, StringGridIcon,
    SupabaseConnectionIcon, SupabaseTableIcon, SupabaseQueryIcon, SupabaseTransactionIcon, DprIcon, PasIcon, DfmIcon, ProjectIcon
} from './components/Icons';

// Declara o Prism como uma variável global para satisfazer o TypeScript
declare const Prism: any;

const initialDpr = `program Project1;

uses
  Forms,
  Unit1 in 'Unit1.pas' {Form1};

{$R *.res}

begin
  Application.Initialize;
  Application.CreateForm(TForm1, Form1);
  Application.Run;
end.
`;

const initialPas = `unit Unit1;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, StdCtrls;

type
  TForm1 = class(TForm)
    Button1: TButton;
    Edit1: TEdit;
    Label1: TLabel;
    procedure Button1Click(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  Form1: TForm1;

implementation

{$R *.dfm}

procedure TForm1.Button1Click(Sender: TObject);
begin
  ShowMessage('Olá, ' + Edit1.Text);
end;

end.
`;

const initialDfm = `object Form1: TForm1
  Left = 0
  Top = 0
  Caption = 'Meu App Delphi'
  ClientHeight = 220
  ClientWidth = 450
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  PixelsPerInch = 96
  TextHeight = 13
  object Label1: TLabel
    Left = 40
    Top = 40
    Width = 84
    Height = 13
    Caption = 'Digite seu nome:'
  end
  object Edit1: TEdit
    Left = 40
    Top = 60
    Width = 185
    Height = 21
    TabOrder = 0
    Text = 'Usuário'
  end
  object Button1: TButton
    Left = 40
    Top = 100
    Width = 121
    Height = 41
    Caption = 'Clique Aqui'
    TabOrder = 1
    OnClick = Button1Click
  end
end
`;

const initialUnitOnlyPas = `unit UnitName;

interface

uses
  SysUtils, Classes;

type
  TMyObject = class(TObject)
  private
    FMyField: Integer;
  public
    constructor Create;
    destructor Destroy; override;
    property MyField: Integer read FMyField write FMyField;
  end;

implementation

{ TMyObject }

constructor TMyObject.Create;
begin
  inherited;
  FMyField := 0;
end;

destructor TMyObject.Destroy;
begin
  inherited;
end;

end.
`;


type ActiveView = 'code' | 'design';
type NewItemType = 'project' | 'unit' | 'form';
type LeftPanelTab = 'structure' | 'inspector';

const parseDfm = (dfmContent: string): DfmComponent[] => {
    const components: DfmComponent[] = [];
    if (!dfmContent) return components;

    const lines = dfmContent.replace(/\r\n/g, '\n').split('\n');
    const componentStack: (DfmComponent | null)[] = [null];
    let currentComponent: DfmComponent | null = null;
    let indentStack: number[] = [-1];

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const indent = line.length - line.trimStart().length;
        const objectMatch = trimmedLine.match(/^object\s+([^:]+):\s+(T\w+)/);

        if (objectMatch) {
            while (indent <= indentStack[indentStack.length - 1]) {
                componentStack.pop();
                indentStack.pop();
            }
            const parent = componentStack[componentStack.length - 1];

            const [, id, type] = objectMatch;
            const newComponent: DfmComponent = {
                id,
                type,
                properties: { Name: id },
                children: [],
                parent,
            };

            if (parent) {
                parent.children.push(newComponent);
            } else {
                components.push(newComponent);
            }

            componentStack.push(newComponent);
            indentStack.push(indent);
            currentComponent = newComponent;
        } else if (trimmedLine === 'end' && componentStack.length > 1) {
             // Handled by indent logic
        } else if (currentComponent) {
            const propMatch = trimmedLine.match(/^([\w\.]+)\s*=\s*(.+)/);
            if (propMatch) {
                const [, key, value] = propMatch;
                const numValue = parseInt(value, 10);
                currentComponent.properties[key] = isNaN(numValue) || value.includes('.') ? value.replace(/'/g, '') : numValue;
            }
        }
    }
    return components;
};

const updateDfmProperties = (dfmContent: string, componentId: string, propsToUpdate: Record<string, any>): string => {
    const lines = dfmContent.split('\n');
    let inComponent = false;
    let componentEndIndex = -1;
    let componentIndent = 0;
    const propsFound: Record<string, boolean> = {};
    Object.keys(propsToUpdate).forEach(p => propsFound[p] = false);

    const updatedLines = lines.map((line, index) => {
        if (line.trim().startsWith(`object ${componentId}:`)) {
            inComponent = true;
            componentIndent = line.search(/\S|$/);
        }
        if (inComponent && line.trim().toLowerCase() === 'end') {
            if (line.search(/\S|$/) <= componentIndent) {
                if (componentEndIndex === -1) componentEndIndex = index;
                inComponent = false;
            }
        }
        if (inComponent) {
            for (const prop of Object.keys(propsToUpdate)) {
                // Handle cases where prop might not exist yet but we want to set it to 'alNone' or empty
                if (propsToUpdate[prop] === 'alNone' || propsToUpdate[prop] === '') {
                     const propRegex = new RegExp(`^(\\s+)(${prop.replace('.', '\\.')})(\\s*=\\s*)(.*)`);
                     if (line.match(propRegex)) {
                        propsFound[prop] = true;
                        return ''; // Remove the line
                     }
                }
                const propRegex = new RegExp(`^(\\s+)(${prop.replace('.', '\\.')})(\\s*=\\s*)(.*)`);
                const match = line.match(propRegex);
                if (match) {
                    propsFound[prop] = true;
                    const value = propsToUpdate[prop];
                    const newValue = typeof value === 'string' && !/^\d+$/.test(value) && !value.startsWith('cl') && typeof value !== 'boolean' ? `'${value}'` : value;
                    return `${match[1]}${prop}${match[3]}${newValue}`;
                }
            }
        }
        return line;
    }).filter(line => line !== ''); // Filter out removed lines

    const propsToAdd: string[] = [];
    for (const [prop, value] of Object.entries(propsToUpdate)) {
        if (!propsFound[prop] && value !== 'alNone' && value !== '') {
            const newValue = typeof value === 'string' && !/^\d+$/.test(value) && !value.startsWith('cl') && typeof value !== 'boolean' ? `'${value}'` : value;
            const indentation = ' '.repeat(componentIndent + 2);
            propsToAdd.push(`${indentation}${prop} = ${newValue}`);
        }
    }
    
    if (propsToAdd.length > 0 && componentEndIndex > -1) {
        // Recalculate componentEndIndex as lines might have been removed
        let tempInComponent = false;
        let tempComponentIndent = 0;
        let finalEndIndex = -1;
        for (let i = 0; i < updatedLines.length; i++) {
             if (updatedLines[i].trim().startsWith(`object ${componentId}:`)) {
                tempInComponent = true;
                tempComponentIndent = updatedLines[i].search(/\S|$/);
            }
             if (tempInComponent && updatedLines[i].trim().toLowerCase() === 'end') {
                if (updatedLines[i].search(/\S|$/) <= tempComponentIndent) {
                     finalEndIndex = i;
                     break;
                }
            }
        }
        if (finalEndIndex !== -1) {
            updatedLines.splice(finalEndIndex, 0, ...propsToAdd);
        }
    }

    return updatedLines.join('\n');
};

function flattenDfmComponents(components: DfmComponent[]): DfmComponent[] {
    const result: DfmComponent[] = [];
    function recurse(comps: DfmComponent[]) {
        for (const comp of comps) {
            result.push(comp);
            if (comp.children && comp.children.length > 0) {
                recurse(comp.children);
            }
        }
    }
    recurse(components);
    return result;
}

const removeComponentFromDfm = (dfmContent: string, componentId: string): string => {
    const lines = dfmContent.split('\n');
    const searchRegex = new RegExp(`^(\\s*)object\\s+${componentId}:`, 'i');
    let startIndex = -1;
    let startIndent = -1;

    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(searchRegex);
        if (match) {
            startIndex = i;
            startIndent = match[1].length;
            break;
        }
    }

    if (startIndex === -1) {
        return dfmContent; // Component not found
    }

    let stack = 1;
    let endIndex = -1;
    const objectStartRegex = /^\s*object\s/i;
    const endRegex = /^\s*end\s*$/i;

    for (let i = startIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        const currentIndent = line.search(/\S|$/);
        const trimmedLine = line.trim();

        if (objectStartRegex.test(trimmedLine)) {
            stack++;
        } else if (endRegex.test(trimmedLine)) {
            stack--;
            // The matching 'end' must have the same indentation as the starting 'object'
            if (stack === 0 && currentIndent === startIndent) {
                endIndex = i;
                break;
            }
        }
    }

    if (endIndex !== -1) {
        lines.splice(startIndex, endIndex - startIndex + 1);
        return lines.join('\n');
    }

    return dfmContent; // Should not happen if DFM is well-formed
};

const removeComponentDeclarationsFromPas = (pasCode: string, componentName: string, componentType: string, eventHandlers: string[]): string => {
    let modifiedPas = pasCode;

    // 1. Remove field declaration (case-insensitive, tolerant to whitespace)
    const fieldRegex = new RegExp(`^\\s*${componentName}\\s*:\\s*${componentType};\\s*$`, 'im');
    modifiedPas = modifiedPas.replace(fieldRegex, '');

    // 2. Remove event handlers
    eventHandlers.forEach(handlerName => {
        if (!handlerName) return;
        
        // Remove interface declaration (tolerant to whitespace)
        const interfaceRegex = new RegExp(`^\\s*procedure\\s+${handlerName}\\s*\\(Sender:\\s*TObject\\);\\s*$`, 'im');
        modifiedPas = modifiedPas.replace(interfaceRegex, '');

        // Remove implementation block (tolerant to whitespace and line breaks)
        const implementationRegex = new RegExp(
            `^\\s*procedure\\s+TForm1\\.${handlerName}\\s*\\(Sender:\\s*TObject\\);\\s*[\\s\\S]*?^\\s*end;\\s*$`,
            'gim'
        );
        modifiedPas = modifiedPas.replace(implementationRegex, '');
    });

    // Clean up excessive newlines that might result from removals
    return modifiedPas.replace(/(\r?\n\s*){3,}/g, '\r\n\r\n').trim();
};

const FormPreview = ({ dfmCode, onSelectComponent, selectedComponentId, onDrop, onComponentUpdate }: { dfmCode: string, onSelectComponent: (id: string | null) => void, selectedComponentId: string | null, onDrop: (type: string, x: number, y: number, parentId?: string | null) => void, onComponentUpdate: (id: string, updates: Record<string, any>) => void }) => {
    const components = parseDfm(dfmCode);
    const form = components.find(c => c.type.startsWith('TForm'));
    const formRef = useRef<HTMLDivElement>(null);
    const [interaction, setInteraction] = useState<any>(null);
    const [overrideStyles, setOverrideStyles] = useState<Record<string, Record<string, any>>>({});

    const componentLayouts = useMemo(() => {
        const layouts: Record<string, React.CSSProperties> = {};
        if (!form) return layouts;

        const processChildren = (
            children: DfmComponent[], 
            parentRect: { left: number; top: number; width: number; height: number }
        ): Record<string, React.CSSProperties> => {
            let availableRect = { ...parentRect };
            const childLayouts: Record<string, React.CSSProperties> = {};

            const sortedChildren = [...children].sort((a, b) => {
                const order: Record<string, number> = { alTop: 1, alBottom: 2, alLeft: 3, alRight: 4, alClient: 5, alNone: 99 };
                const alignA = order[a.properties.Align as string] || order.alNone;
                const alignB = order[b.properties.Align as string] || order.alNone;
                if (alignA !== alignB) return alignA - alignB;
                return children.indexOf(a) - children.indexOf(b);
            });

            for (const comp of sortedChildren) {
                const props = { ...comp.properties, ...(overrideStyles[comp.id] || {}) };
                const align = props.Align as string;
                let layout: React.CSSProperties = { position: 'absolute' };

                switch (align) {
                    case 'alTop':
                        const topHeight = Math.min(props.Height as number || 25, availableRect.height);
                        layout.top = `${availableRect.top}px`;
                        layout.left = `${availableRect.left}px`;
                        layout.width = `${availableRect.width}px`;
                        layout.height = `${topHeight}px`;
                        availableRect.top += topHeight;
                        availableRect.height = Math.max(0, availableRect.height - topHeight);
                        break;
                    case 'alBottom':
                        const bottomHeight = Math.min(props.Height as number || 25, availableRect.height);
                        layout.top = `${availableRect.top + availableRect.height - bottomHeight}px`;
                        layout.left = `${availableRect.left}px`;
                        layout.width = `${availableRect.width}px`;
                        layout.height = `${bottomHeight}px`;
                        availableRect.height = Math.max(0, availableRect.height - bottomHeight);
                        break;
                    case 'alLeft':
                        const leftWidth = Math.min(props.Width as number || 75, availableRect.width);
                        layout.top = `${availableRect.top}px`;
                        layout.left = `${availableRect.left}px`;
                        layout.width = `${leftWidth}px`;
                        layout.height = `${availableRect.height}px`;
                        availableRect.left += leftWidth;
                        availableRect.width = Math.max(0, availableRect.width - leftWidth);
                        break;
                    case 'alRight':
                        const rightWidth = Math.min(props.Width as number || 75, availableRect.width);
                        layout.top = `${availableRect.top}px`;
                        layout.left = `${availableRect.left + availableRect.width - rightWidth}px`;
                        layout.width = `${rightWidth}px`;
                        layout.height = `${availableRect.height}px`;
                        availableRect.width = Math.max(0, availableRect.width - rightWidth);
                        break;
                    case 'alClient':
                        layout.top = `${availableRect.top}px`;
                        layout.left = `${availableRect.left}px`;
                        layout.width = `${Math.max(0, availableRect.width)}px`;
                        layout.height = `${Math.max(0, availableRect.height)}px`;
                        availableRect = {top: 0, left: 0, width: 0, height: 0};
                        break;
                    default: // alNone or undefined
                        layout = {
                            ...layout,
                            left: `${(props.Left as number || 0) + availableRect.left}px`,
                            top: `${(props.Top as number || 0) + availableRect.top}px`,
                            width: `${props.Width || 75}px`,
                            height: `${props.Height || 25}px`,
                        };
                        break;
                }
                
                childLayouts[comp.id] = layout;

                if (comp.children && comp.children.length > 0 && (comp.type === 'TPanel' || comp.type === 'TGroupBox' || comp.type.startsWith('TForm'))) {
                    const grandChildLayouts = processChildren(comp.children, {
                        left: 0, top: 0,
                        width: parseFloat(layout.width as string) || 0,
                        height: parseFloat(layout.height as string) || 0,
                    });
                    Object.assign(childLayouts, grandChildLayouts);
                }
            }
            return childLayouts;
        };

        const currentFormProps = form ? { ...form.properties, ...(overrideStyles[form.id] || {}) } : null;
        const formLayouts = processChildren(form.children, {
            left: 0, top: 0,
            width: currentFormProps.ClientWidth as number || 450,
            height: (currentFormProps.ClientHeight as number || 220),
        });

        Object.assign(layouts, formLayouts);

        return layouts;
    }, [dfmCode, overrideStyles, form]);

    useEffect(() => {
        if (Object.keys(overrideStyles).length > 0) {
            // Persist the final state from the temporary styles
            const idToUpdate = Object.keys(overrideStyles)[0];
            if (idToUpdate && overrideStyles[idToUpdate] && Object.keys(overrideStyles[idToUpdate]).length > 0) {
                 onComponentUpdate(idToUpdate, overrideStyles[idToUpdate] as Record<string, number>);
            }
            // Clear the temporary styles after persisting, ready for the next interaction
            setOverrideStyles({});
        }
    }, [interaction]); // Depend only on interaction state change (specifically when it becomes null)


    useEffect(() => {
        if (!interaction) return;

        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!interaction) return;

            const dx = e.clientX - interaction.startX;
            const dy = e.clientY - interaction.startY;
            let updates: Record<string, number> = {};
            const targetId = interaction.id;
            
            const currentProps = {
                ...(flatComponents.find(c => c.id === targetId)?.properties || {}),
                ...(overrideStyles[targetId] || {})
            };

            if (interaction.type === 'move') {
                updates = { Left: interaction.startLeft + dx, Top: interaction.startTop + dy };
            } else if (interaction.type === 'resize') {
                 const isAligned = interaction.startAlign && interaction.startAlign !== 'alNone';

                if (interaction.handle.includes('e')) {
                     if (!isAligned || interaction.startAlign === 'alLeft') updates.Width = Math.max(10, interaction.startWidth + dx);
                }
                if (interaction.handle.includes('w')) {
                     if (!isAligned || interaction.startAlign === 'alRight') updates.Width = Math.max(10, interaction.startWidth - dx);
                     if (!isAligned) updates.Left = interaction.startLeft + dx;
                }
                if (interaction.handle.includes('s')) {
                     if (!isAligned || interaction.startAlign === 'alTop') updates.Height = Math.max(10, interaction.startHeight + dy);
                }
                if (interaction.handle.includes('n')) {
                    if (!isAligned || interaction.startAlign === 'alBottom') {
                        updates.Height = Math.max(10, interaction.startHeight - dy);
                    }
                    if (!isAligned) {
                         updates.Top = interaction.startTop + dy;
                    }
                }
            } else if (interaction.type === 'form-resize') {
                if (interaction.handle.includes('e')) updates.ClientWidth = Math.max(100, interaction.startWidth + dx);
                if (interaction.handle.includes('s')) updates.ClientHeight = Math.max(100, interaction.startHeight + dy);
                if (interaction.handle.includes('w')) {
                    updates.ClientWidth = Math.max(100, interaction.startWidth - dx);
                }
                if (interaction.handle.includes('n')) {
                    updates.ClientHeight = Math.max(100, interaction.startHeight - dy);
                }
            }
             setOverrideStyles(prev => ({ ...prev, [targetId]: { ...prev[targetId], ...updates } }));
        };

        const handleMouseUp = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setInteraction(null); // This will trigger the useEffect to persist data
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp, { once: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [interaction, onComponentUpdate]);

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const type = e.dataTransfer.getData('componentType');
        if (type && formRef.current) {
            const rect = formRef.current.getBoundingClientRect();
            onDrop(type, Math.round(e.clientX - rect.left), Math.round(e.clientY - rect.top), form?.id);
        }
    };
    
    const flatComponents = useMemo(() => {
        return flattenDfmComponents(components);
    }, [components]);

    const renderComponent = (comp: DfmComponent) => {
        const isSelected = selectedComponentId === comp.id;
        const currentProps = { ...comp.properties, ...(overrideStyles[comp.id] || {}) };
        const isAligned = currentProps.Align && currentProps.Align !== 'alNone';
        
        const style: React.CSSProperties = {
            ...(componentLayouts[comp.id] || {}),
            fontFamily: currentProps['Font.Name'] as string || 'Tahoma, sans-serif',
            fontSize: `${-1 * (currentProps['Font.Height'] as number || -11)}px`,
            color: currentProps['Font.Color'] as string || 'clWindowText',
        };

        const handleInteractionStart = (e: React.MouseEvent, type: 'move' | 'resize', handle?: string) => {
             e.preventDefault();
             e.stopPropagation();
             setInteraction({
                type,
                handle,
                id: comp.id,
                startX: e.clientX,
                startY: e.clientY,
                startLeft: currentProps.Left || 0,
                startTop: currentProps.Top || 0,
                startWidth: currentProps.Width || 75,
                startHeight: currentProps.Height || 25,
                startAlign: currentProps.Align || 'alNone',
            });
        };

        const handleMouseDownOnComponent = (e: React.MouseEvent) => {
            e.stopPropagation();
            onSelectComponent(comp.id); // Always select on click
            if (!isAligned) {
                handleInteractionStart(e, 'move'); // Only start move interaction if not aligned
            }
        };
        
        const wrapperStyle: React.CSSProperties = { 
            ...style, 
            cursor: isAligned ? 'default' : 'move', 
            boxSizing: 'border-box',
        };

        if(isSelected) {
            if (isAligned) {
                wrapperStyle.outline = '2px dashed #38bdf8'; // sky-400
                wrapperStyle.outlineOffset = '1px';
            } else {
                 wrapperStyle.outline = '2px solid #38bdf8';
                 wrapperStyle.outlineOffset = '1px';
            }
        }

        const handleContainerDrop = (e: React.DragEvent, parentId: string) => {
            e.preventDefault();
            e.stopPropagation();
            const type = e.dataTransfer.getData('componentType');
            const target = e.currentTarget as HTMLDivElement;
            if (type && target) {
                const rect = target.getBoundingClientRect();
                onDrop(type, Math.round(e.clientX - rect.left), Math.round(e.clientY - rect.top), parentId);
            }
        };

        const renderNonVisual = (Icon: React.ElementType) => (
             <div key={comp.id} style={{ ...style, width: '32px', height: '32px' }} onMouseDown={handleMouseDownOnComponent} className="flex items-center justify-center bg-gray-200/50 border border-dashed border-gray-500 rounded-sm cursor-move" title={comp.id}>
                <Icon />
                {isSelected && <div className="absolute inset-0 border-2 border-blue-400 pointer-events-none" />}
            </div>
        );

        const getHandlesForAlign = (align: string | undefined): string[] => {
            switch (align) {
                case 'alTop': return ['s'];
                case 'alBottom': return ['n'];
                case 'alLeft': return ['e'];
                case 'alRight': return ['w'];
                case 'alNone':
                case undefined:
                    return ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'];
                default: // alClient, etc.
                    return [];
            }
        };

        const renderVisualComponent = (type: string, props: any, children: React.ReactNode) => (
             <div key={comp.id} style={wrapperStyle} onMouseDown={handleMouseDownOnComponent} onDragOver={e => { e.preventDefault(); e.stopPropagation(); }} onDrop={(e) => handleContainerDrop(e, comp.id)}>
                {React.createElement(type, props, children)}
                {isSelected && getHandlesForAlign(currentProps.Align as string).map(handle => (
                    <div key={handle} className={`resize-handle ${handle}`} onMouseDown={e => handleInteractionStart(e, 'resize', handle)} />
                ))}
            </div>
        );
        
        const commonProps = {
            className: "w-full h-full",
            style: { boxSizing: 'border-box', userSelect: 'none' } as React.CSSProperties,
        };

        switch (comp.type) {
            case 'TButton':
                return renderVisualComponent('button', { ...commonProps, className: `${commonProps.className} bg-[#F0F0F0] border border-[#7F9DB9] rounded-sm shadow-sm` }, currentProps.Caption || comp.id);
            case 'TEdit':
                return renderVisualComponent('input', { ...commonProps, type: "text", defaultValue: currentProps.Text as string || '', className: `${commonProps.className} bg-white border border-gray-400 p-1`, readOnly: true }, null);
            case 'TLabel':
                 return renderVisualComponent('label', { ...commonProps, style: { ...commonProps.style, width: 'auto', height: 'auto' }, className: "bg-transparent" }, currentProps.Caption || comp.id);
            case 'TPanel':
                return renderVisualComponent('div', { ...commonProps, className: `${commonProps.className} bg-[#ECE9D8] border border-gray-500 relative overflow-hidden`}, comp.children.map(renderComponent));
             case 'TGroupBox':
                return renderVisualComponent('fieldset', { ...commonProps, className: `${commonProps.className} border border-gray-400 p-2 relative overflow-hidden` }, [<legend key="legend" className="px-1 text-xs pointer-events-none">{currentProps.Caption || comp.id}</legend>, ...comp.children.map(renderComponent)]);
            case 'TImage':
                return renderVisualComponent('div', { ...commonProps, className: `${commonProps.className} border border-gray-500 flex items-center justify-center bg-gray-200` }, <ImageIcon />);
            case 'TStringGrid':
                return renderVisualComponent(
                    'div',
                    { ...commonProps, className: `${commonProps.className} bg-white border border-gray-400 overflow-hidden` },
                    <div className="w-full h-full grid grid-cols-4 grid-rows-4 pointer-events-none">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className="border border-gray-200 text-xs truncate p-px"></div>
                        ))}
                    </div>
                );
            case 'TCheckBox':
                return renderVisualComponent('div', { ...commonProps, style: { ...commonProps.style, width: 'auto', height: 'auto' }, className: "flex items-center gap-1"}, [
                    <input key="cb" type="checkbox" checked={currentProps.Checked === 'True'} className="pointer-events-none" readOnly/>,
                    <label key="lbl">{currentProps.Caption || comp.id}</label>
                ]);
             case 'TMemo':
                return renderVisualComponent('textarea', { ...commonProps, className: `${commonProps.className} bg-white border border-gray-400 p-1 font-mono`, defaultValue: (currentProps.Lines as any)?.text || '', readOnly: true }, null);
             case 'TComboBox':
                return renderVisualComponent('select', { ...commonProps, className: `${commonProps.className} bg-white border border-gray-400` }, <option>{currentProps.Text || comp.id}</option>);
            case 'TDataSource': return renderNonVisual(DataSourceIcon);
            case 'TSupabaseConnection': return renderNonVisual(SupabaseConnectionIcon);
            case 'TSupabaseTable': return renderNonVisual(SupabaseTableIcon);
            case 'TSupabaseQuery': return renderNonVisual(SupabaseQueryIcon);
            case 'TSupabaseTransaction': return renderNonVisual(SupabaseTransactionIcon);
             case 'TMainMenu':
                 return (
                    <div key={comp.id} style={{...wrapperStyle, left: '0px', top: '0px', width: '100%', height: '24px'}} onMouseDown={handleMouseDownOnComponent} className="bg-gray-200 border-b border-gray-400 flex items-center px-2 text-sm" title={comp.id}>
                        <span>{currentProps.Name || comp.id}</span>
                         {isSelected && <div className="absolute inset-0 border-2 border-blue-400 pointer-events-none" />}
                    </div>
                 );
            default:
                return renderVisualComponent('div', { ...commonProps, className: `${commonProps.className} border border-dashed border-gray-500 flex items-center justify-center text-xs text-gray-400` }, <span>{comp.type}</span>);
        }
    }
    
    const currentFormProps = form ? { ...form.properties, ...(overrideStyles[form.id] || {}) } : null;

    return (
        <div className="w-full h-full p-4 bg-gray-700 overflow-auto" onMouseDown={() => onSelectComponent(form?.id || null)} onDragOver={handleDragOver} onDrop={handleDrop}>
            <div
                ref={formRef}
                className="relative bg-[#ECE9D8] border border-gray-400 shadow-lg overflow-hidden"
                style={{
                    width: currentFormProps?.ClientWidth ? `${currentFormProps.ClientWidth}px` : '450px',
                    height: currentFormProps?.ClientHeight ? `${currentFormProps.ClientHeight}px` : '220px',
                    outline: selectedComponentId === form?.id ? '2px solid #38bdf8' : 'none',
                    outlineOffset: '2px',
                    position: 'relative', // for child alignment context
                }}
            >
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#0A246A] to-[#A6CAF0] flex items-center px-2 pointer-events-none">
                    <span className="text-white text-xs font-sans">{currentFormProps?.Caption || 'Form'}</span>
                </div>
                 <div className="absolute top-6 left-0 right-0 bottom-0 overflow-hidden">
                    {form?.children.map(renderComponent)}
                </div>

                {form && selectedComponentId === form.id && ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'].map(handle => (
                    <div
                        key={handle}
                        className={`resize-handle ${handle}`}
                        onMouseDown={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setInteraction({
                                type: 'form-resize',
                                handle,
                                id: form.id,
                                startX: e.clientX,
                                startY: e.clientY,
                                startWidth: currentFormProps.ClientWidth || 450,
                                startHeight: currentFormProps.ClientHeight || 220,
                            });
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const componentPalette = [
    { name: 'TButton', icon: <ButtonIcon/>, category: 'Padrão' },
    { name: 'TEdit', icon: <EditIcon/>, category: 'Padrão' },
    { name: 'TLabel', icon: <LabelIcon/>, category: 'Padrão' },
    { name: 'TPanel', icon: <PanelIcon/>, category: 'Padrão' },
    { name: 'TCheckBox', icon: <CheckboxIcon/>, category: 'Padrão' },
    { name: 'TMemo', icon: <MemoIcon/>, category: 'Padrão' },
    { name: 'TComboBox', icon: <ComboBoxIcon/>, category: 'Padrão' },
    { name: 'TRadioGroup', icon: <RadioGroupIcon/>, category: 'Padrão' },
    { name: 'TGroupBox', icon: <GroupBoxIcon/>, category: 'Padrão' },
    { name: 'TImage', icon: <ImageIcon/>, category: 'Adicional' },
    { name: 'TStringGrid', icon: <StringGridIcon/>, category: 'Adicional' },
    { name: 'TMainMenu', icon: <MenuIcon/>, category: 'Padrão' },
    { name: 'TDataSource', icon: <DataSourceIcon/>, category: 'Acesso a Dados' },
    { name: 'TSupabaseConnection', icon: <SupabaseConnectionIcon/>, category: 'Supabase' },
    { name: 'TSupabaseTable', icon: <SupabaseTableIcon/>, category: 'Supabase' },
    { name: 'TSupabaseQuery', icon: <SupabaseQueryIcon/>, category: 'Supabase' },
    { name: 'TSupabaseTransaction', icon: <SupabaseTransactionIcon/>, category: 'Supabase' },
];

const componentEvents: Record<string, string[]> = {
    'TButton': ['OnClick', 'OnMouseDown', 'OnMouseUp'],
    'TEdit': ['OnChange', 'OnKeyPress', 'OnEnter', 'OnExit'],
    'TLabel': ['OnClick'],
    'TCheckBox': ['OnClick'],
    'TMemo': ['OnChange', 'OnKeyDown'],
    'TComboBox': ['OnChange', 'OnSelect'],
    'TStringGrid': ['OnClick', 'OnDblClick', 'OnSelectCell'],
    'TPanel': ['OnClick', 'OnDblClick'],
    'TForm': ['OnCreate', 'OnShow', 'OnClose', 'OnResize'],
    'TSupabaseConnection': ['OnConnected', 'OnDisconnected', 'OnError'],
    'TSupabaseTable': ['BeforeOpen', 'AfterOpen', 'BeforePost', 'AfterPost', 'BeforeDelete', 'AfterDelete', 'OnError'],
    'TSupabaseQuery': ['BeforeExec', 'AfterExec', 'OnError'],
    'TSupabaseTransaction': ['OnCommit', 'OnRollback'],
}

const StructureTreeView = ({ components, selectedId, onSelect }: { components: DfmComponent[], selectedId: string | null, onSelect: (id: string | null) => void }) => {
    const renderNode = (component: DfmComponent, level = 0) => (
        <div key={component.id} style={{ paddingLeft: `${level * 16}px` }}>
            <button
                onClick={(e) => { e.stopPropagation(); onSelect(component.id); }}
                className={`w-full text-left text-sm p-1 rounded flex items-center gap-2 ${selectedId === component.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
            >
                <span>{component.id} <span className="text-gray-400 text-xs">({component.type})</span></span>
            </button>
            {component.children && component.children.length > 0 && (
                <div className="border-l border-gray-700/50">
                    {component.children.map(c => renderNode(c, level + 1))}
                </div>
            )}
        </div>
    );
    return <div className="p-2 space-y-1 overflow-y-auto"><div className="space-y-1">{components.map(c => renderNode(c))}</div></div>;
};

const ProjectExplorer = ({ files, activeFile, onSelectFile }: { files: string[], activeFile: string, onSelectFile: (file: string) => void }) => {
    const getFileIcon = (filename: string) => {
        if (filename.endsWith('.dpr')) return <DprIcon />;
        if (filename.endsWith('.pas')) return <PasIcon />;
        if (filename.endsWith('.dfm')) return <DfmIcon />;
        return <FileIcon />;
    };

    return (
        <div className="space-y-1">
            {files.map(file => (
                <button
                    key={file}
                    onClick={() => onSelectFile(file)}
                    className={`w-full text-left text-sm p-1 rounded flex items-center gap-2 ${activeFile === file ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                >
                    {getFileIcon(file)}
                    <span>{file}</span>
                </button>
            ))}
        </div>
    );
};

const NewItemModal = ({ onCreate, onClose }: { onCreate: (type: NewItemType) => void, onClose: () => void }) => {
    const [selectedType, setSelectedType] = useState<NewItemType | null>(null);

    const items = [
        { type: 'project', icon: <FileIcon />, title: 'Novo Projeto', description: 'Cria um projeto completo com formulário, unidade e arquivo de projeto padrão.' },
        { type: 'form', icon: <PanelIcon />, title: 'Novo Formulário', description: 'Cria um novo formulário (.dfm) e sua unidade (.pas) associada.' },
        { type: 'unit', icon: <SparklesIcon />, title: 'Nova Unidade', description: 'Cria um novo arquivo de unidade (.pas) em branco, sem formulário.' },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-4">Criar Novo</h2>
                <div className="space-y-3">
                    {items.map(item => (
                        <button
                            key={item.type}
                            onClick={() => setSelectedType(item.type as NewItemType)}
                            className={`w-full flex items-center p-4 rounded-md border-2 transition-all text-left ${selectedType === item.type ? 'bg-blue-600/20 border-blue-500' : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'}`}
                        >
                            <div className="mr-4 text-blue-400">{item.icon}</div>
                            <div>
                                <h3 className="font-semibold text-white">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="flex justify-end mt-6 space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={() => selectedType && onCreate(selectedType)}
                        disabled={!selectedType}
                        className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Criar
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function App(): React.ReactElement {
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({
      'Project1.dpr': initialDpr,
      'Unit1.pas': initialPas,
      'Unit1.dfm': initialDfm
  });
  const [activeFile, setActiveFile] = useState<string>('Unit1.pas');
  const [activeEditorView, setActiveEditorView] = useState<ActiveView>('code');
  
  const [output, setOutput] = useState('Bem-vindo à Delphi Online IDE! Clique em "Executar" para começar.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OutputType>(OutputType.MESSAGES);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [leftPanelTab, setLeftPanelTab] = useState<LeftPanelTab>('inspector');


  // Panel Resizing State
  const [leftPanelWidth, setLeftPanelWidth] = useState(256);
  const [rightPanelWidth, setRightPanelWidth] = useState(240);
  const [outputHeight, setOutputHeight] = useState(window.innerHeight / 4);
  const [rightPanelTopHeight, setRightPanelTopHeight] = useState(window.innerHeight / 3);
  const isResizingX = useRef<string | null>(null);
  const isResizingY = useRef(false);
  const isResizingRightPanelY = useRef(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const hasDfmForActiveFile = activeFile.endsWith('.pas') && projectFiles[activeFile.replace('.pas', '.dfm')];

  useEffect(() => {
    if (activeEditorView === 'design' && !hasDfmForActiveFile) {
        setActiveEditorView('code');
    }
  }, [activeFile, hasDfmForActiveFile, activeEditorView]);


  const handleMouseDownX = (e: React.MouseEvent, panel: 'left' | 'right') => {
    isResizingX.current = panel;
    e.preventDefault();
  };

  const handleMouseDownY = (e: React.MouseEvent) => {
    isResizingY.current = true;
    e.preventDefault();
  };

  const handleMouseDownRightY = (e: React.MouseEvent) => {
    isResizingRightPanelY.current = true;
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // X-axis resizing
    if (isResizingX.current === 'left') {
        const newWidth = e.clientX;
        if (newWidth > 200 && newWidth < 500) setLeftPanelWidth(newWidth);
    }
    if (isResizingX.current === 'right') {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 150 && newWidth < 500) setRightPanelWidth(newWidth);
    }
    // Y-axis resizing
    if (isResizingY.current) {
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight > 80 && newHeight < window.innerHeight - 200) {
            setOutputHeight(newHeight);
        }
    }
    // Y-axis resizing for right panel
    if (isResizingRightPanelY.current && mainContainerRef.current) {
        const topOffset = mainContainerRef.current.getBoundingClientRect().top;
        const newHeight = e.clientY - topOffset;
        const totalHeight = mainContainerRef.current.clientHeight;
        if (newHeight > 100 && newHeight < totalHeight - 100) {
            setRightPanelTopHeight(newHeight);
        }
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizingX.current = null;
    isResizingY.current = false;
    isResizingRightPanelY.current = false;
  }, []);
  
  const handleDeleteComponent = useCallback(() => {
    // This function needs refactoring to support multi-unit projects.
    // For now, it will only correctly work on the components of Unit1.
    const formDfmFile = 'Unit1.dfm';
    const formPasFile = 'Unit1.pas';

    if (!selectedComponentId || selectedComponentId.toLowerCase().includes('form')) {
        return; // Can't delete the form
    }

    const allComponents = parseDfm(projectFiles[formDfmFile]);
    const flatComponents = flattenDfmComponents(allComponents);
    const componentToDelete = flatComponents.find(c => c.id.toLowerCase() === selectedComponentId.toLowerCase());

    if (!componentToDelete) {
        console.error(`Component to delete "${selectedComponentId}" not found in DFM structure.`);
        return;
    }

    if (window.confirm(`Tem certeza que deseja apagar o componente '${selectedComponentId}' e todos os seus filhos? Esta ação não pode ser desfeita.`)) {
        const componentsAndChildren = [componentToDelete, ...flattenDfmComponents(componentToDelete.children)];

        // 1. Remove component tree from DFM
        let newDfm = removeComponentFromDfm(projectFiles[formDfmFile], selectedComponentId);

        // 2. Remove declarations and events for the component and all its children from PAS
        let newPas = projectFiles[formPasFile];
        componentsAndChildren.forEach(comp => {
            const eventHandlers = Object.entries(comp.properties)
                .filter(([key]) => key.startsWith('On'))
                .map(([, value]) => value as string)
                .filter(Boolean);

            newPas = removeComponentDeclarationsFromPas(newPas, comp.id, comp.type, eventHandlers);
        });

        setProjectFiles(prev => ({ ...prev, [formDfmFile]: newDfm, [formPasFile]: newPas }));
        setSelectedComponentId(null);
        setOutput(`Componente '${selectedComponentId}' e seus filhos foram apagados.`);
        setActiveTab(OutputType.MESSAGES);
    }
}, [projectFiles, selectedComponentId]);
  
  const handleRun = useCallback(() => performAction('run', () => runDelphiCode(projectFiles['Unit1.pas']), OutputType.CONSOLE), [projectFiles]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F9' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handleRun();
    }
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
    }
    if (e.key === 'Delete') {
        const target = e.target as HTMLElement;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
            return;
        }
        e.preventDefault();
        handleDeleteComponent();
    }
  }, [handleRun, handleDeleteComponent]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMouseMove, handleMouseUp, handleKeyDown]);
  
  const handleCodeChange = (newCode: string) => {
     setProjectFiles(prev => ({...prev, [activeFile]: newCode }));
  };
  
  const performAction = async (action: 'compile' | 'run' | 'format' | 'analyze', task: () => Promise<string>, successTab: OutputType) => {
    setIsLoading(true);
    setLoadingAction(action);
    setError(null);
    setActiveTab(successTab);
    setOutput(`${action.charAt(0).toUpperCase() + action.slice(1)}ndo...`);
    try {
      const result = await task();
      if (action === 'format') {
        handleCodeChange(result);
        setOutput('Código formatado com sucesso.');
        setActiveTab(OutputType.MESSAGES);
      } else {
        setOutput(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
      setOutput(`Erro em: ${action}: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleCompile = () => performAction('compile', () => compileDelphiCode(projectFiles[activeFile]), OutputType.MESSAGES);
  const handleFormat = () => {
     performAction('format', () => formatDelphiCode(projectFiles[activeFile]), OutputType.MESSAGES);
  };
  const handleAnalyze = () => performAction('analyze', () => analyzeDelphiCode(projectFiles[activeFile]), OutputType.MESSAGES);
  
  const handleSave = () => {
    localStorage.setItem('delphi-project-files', JSON.stringify(projectFiles));
    setOutput('Projeto salvo com sucesso no armazenamento local do navegador.');
    setActiveTab(OutputType.MESSAGES);
  };

  const handleLoad = () => {
    if(window.confirm('Isso substituirá o projeto atual. Deseja continuar?')) {
        const savedProject = localStorage.getItem('delphi-project-files');
        if (savedProject) {
            setProjectFiles(JSON.parse(savedProject));
            setActiveFile('Unit1.pas');
            setOutput('Projeto carregado do armazenamento local.');
        } else {
            setOutput('Nenhum projeto salvo encontrado.');
        }
        setActiveTab(OutputType.MESSAGES);
    }
  };

  const handleCreateNew = useCallback((type: NewItemType) => {
    const confirmationMessage: Record<NewItemType, string> = {
        project: 'Isso descartará todas as alterações atuais e iniciará um novo projeto. Deseja continuar?',
        form: 'Criar um novo formulário ainda não é suportado. Apenas novas unidades são permitidas.',
        unit: 'Uma nova unidade (.pas) será criada e adicionada ao projeto. Continuar?',
    };

    if (type === 'form') {
        alert(confirmationMessage.form);
        setIsNewModalOpen(false);
        return;
    }

    if(window.confirm(confirmationMessage[type])) {
        let newFiles = { ...projectFiles };
        let message = '';
        let newActiveFile: string = 'Unit1.pas';

        switch(type) {
            case 'project':
                newFiles = { 'Project1.dpr': initialDpr, 'Unit1.pas': initialPas, 'Unit1.dfm': initialDfm };
                message = 'Novo projeto iniciado.';
                newActiveFile = 'Unit1.pas';
                break;
            case 'unit':
                const existingUnits = Object.keys(newFiles)
                    .filter(f => f.startsWith('Unit') && f.endsWith('.pas'))
                    .map(f => parseInt(f.replace('Unit', '').replace('.pas', ''), 10))
                    .filter(n => !isNaN(n));
                const nextUnitNum = existingUnits.length > 0 ? Math.max(...existingUnits) + 1 : 2;
                const newUnitName = `Unit${nextUnitNum}`;
                const newPasFileName = `${newUnitName}.pas`;
                
                const newPasContent = initialUnitOnlyPas.replace(/UnitName/g, newUnitName);
                newFiles[newPasFileName] = newPasContent;

                const dprFile = Object.keys(newFiles).find(f => f.endsWith('.dpr'));
                if (dprFile) {
                    let dprContent = newFiles[dprFile];
                    const newUnitEntry = `  ${newUnitName} in '${newPasFileName}'`;
                    
                    const usesEndRegex = /(\buses\b[\s\S]*?);/i;
                    const match = dprContent.match(usesEndRegex);

                    if (match) {
                        const usesClause = match[0];
                        const semicolonInClauseIdx = usesClause.lastIndexOf(';');
                        const newUsesClause = usesClause.substring(0, semicolonInClauseIdx) +
                                              `,\n${newUnitEntry}` +
                                              usesClause.substring(semicolonInClauseIdx);
                        dprContent = dprContent.replace(usesClause, newUsesClause);
                    } else {
                        const beginRegex = /^\s*begin\b/im;
                        const beginMatch = dprContent.match(beginRegex);
                        if (beginMatch && beginMatch.index !== undefined) {
                             const usesStatement = `uses\n${newUnitEntry};\n\n`;
                             dprContent = dprContent.slice(0, beginMatch.index) + usesStatement + dprContent.slice(beginMatch.index);
                        }
                    }
                    newFiles[dprFile] = dprContent;
                }

                message = `Nova unidade '${newPasFileName}' criada e adicionada ao projeto.`;
                newActiveFile = newPasFileName;
                break;
        }

        setProjectFiles(newFiles);
        setOutput(message);
        setError(null);
        setActiveTab(OutputType.MESSAGES);
        setActiveFile(newActiveFile);
        setSelectedComponentId(null);
        setActiveEditorView('code');
    }
     setIsNewModalOpen(false);
  }, [projectFiles]);
  
  const handleDownloadProject = async () => {
    setOutput('Gerando arquivo .zip do projeto...');
    const zip = new JSZip();
    for (const [filename, content] of Object.entries(projectFiles)) {
        zip.file(filename, content);
    }
    
    try {
        const content = await zip.generateAsync({ type: "blob" });
        const element = document.createElement("a");
        element.href = URL.createObjectURL(content);
        element.download = "DelphiProject.zip";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setOutput('Download do projeto iniciado.');
    } catch (error) {
        setOutput(`Erro ao gerar o .zip: ${error}`);
        setError(String(error));
    }
  };

  const insertComponentIntoDfm = (dfmContent: string, newComponentDfm: string, parentId: string | null): string => {
        const lines = dfmContent.split('\n');
        let parentIndent = 0;
        let targetEndIndex = -1;
        
        const parentIdToFind = parentId || parseDfm(dfmContent).find(c => c.type.startsWith('TForm'))?.id;
        if (!parentIdToFind) return dfmContent;

        const parentLineIndex = lines.findIndex(l => l.trim().startsWith(`object ${parentIdToFind}:`));
        if (parentLineIndex === -1) return dfmContent;

        const indent = lines[parentLineIndex].search(/\S|$/);
        let stack = 1;
        let foundParent = false;

        for (let i = parentLineIndex; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            const lineIndent = line.search(/\S|$/);
            
            if (line.trim().startsWith(`object ${parentIdToFind}:`)) {
                foundParent = true;
            }

            if(foundParent) {
                if (trimmedLine.startsWith('object ') && i > parentLineIndex) {
                    stack++;
                } else if (trimmedLine.toLowerCase() === 'end') {
                    stack--;
                    if (stack === 0 && lineIndent === indent) {
                        targetEndIndex = i;
                        break;
                    }
                }
            }
        }

        if (targetEndIndex === -1) { // Fallback for form
             for (let i = lines.length - 1; i >= 0; i--) {
                const line = lines[i];
                if (line.trim().toLowerCase() === 'end' && (line.match(/^\s*/)?.[0].length || 0) === 0) {
                    targetEndIndex = i;
                    break;
                }
            }
        }
        
        if (targetEndIndex === -1) return dfmContent;

        parentIndent = indent;
        const indentedComponentDfm = newComponentDfm.split('\n').map(line => ' '.repeat(parentIndent + 2) + line).join('\n');
        
        lines.splice(targetEndIndex, 0, indentedComponentDfm);
        return lines.join('\n');
    }

  const handleAddComponent = (componentType: string, x: number, y: number, parentId: string | null = null) => {
      const formPasFile = activeFile;
      const formDfmFile = activeFile.replace('.pas', '.dfm');

      if (!projectFiles[formDfmFile] || !projectFiles[formPasFile]) {
          setOutput('Nenhum formulário ativo para adicionar o componente.');
          return;
      }
      const dfmContent = projectFiles[formDfmFile];
      const pasContent = projectFiles[formPasFile];

      const baseName = componentType.replace('T', '');
      const existingCount = (dfmContent.match(new RegExp(`object ${baseName}\\d+: ${componentType}`, 'g')) || []).length;
      const newName = `${baseName}${existingCount + 1}`;
      
      const properties: Record<string, any> = {
        Left: x,
        Top: y,
        Width: 100,
        Height: 25,
        Caption: `'${newName}'`,
      };

      if (componentType === 'TStringGrid') {
        properties.Width = 200;
        properties.Height = 150;
      }
      if (componentType === 'TLabel') {
          properties.Width = 75;
          properties.Height = 13;
      }

      const isNonVisualDataComponent = ['TDataSource', 'TSupabaseConnection', 'TSupabaseTable', 'TSupabaseQuery', 'TSupabaseTransaction'].includes(componentType);

      if (isNonVisualDataComponent || componentType === 'TMainMenu') {
          delete properties.Width;
          delete properties.Height;
          delete properties.Caption;
      }
      if (componentType === 'TMainMenu') {
        properties.Top = 0; // Fixed position
        properties.Left = 0;
      }
      if (componentType === 'TSupabaseConnection') {
          properties.URL = "''";
          properties.AnonKey = "''";
          properties.Connected = false;
      }
      if (componentType === 'TSupabaseTable') {
          properties.Connection = "''";
          properties.TableName = "''";
          properties.Active = false;
      }
       if (componentType === 'TSupabaseQuery') {
          properties.Connection = "''";
          properties.SQL = "''";
          properties.Active = false;
      }
       if (componentType === 'TSupabaseTransaction') {
          properties.Connection = "''";
          properties.Active = false;
      }

      let newComponentDfm = `object ${newName}: ${componentType}\n`;
      for(const [key, value] of Object.entries(properties)) {
          const formattedValue = typeof value === 'boolean' ? (value ? 'True' : 'False') : value;
          newComponentDfm += `  ${key} = ${formattedValue}\n`;
      }
      newComponentDfm += `end`;
      
      const newDfm = insertComponentIntoDfm(dfmContent, newComponentDfm, parentId);

      const addComponentToPas = (pasCode: string, name: string, type: string): string => {
        if (type.startsWith('TForm')) return pasCode;

        const fieldExistsRegex = new RegExp(`\\b${name}\\s*:\\s*${type}\\b`, 'i');
        if (fieldExistsRegex.test(pasCode)) {
            return pasCode;
        }

        const lines = pasCode.split('\n');
        
        const classDefRegex = /^\s*TForm\d*\s*=\s*class\(TForm\)/i;
        const endClassSectionRegex = /^\s*(private|public|protected|procedure|function|constructor|destructor|end;)/i;

        let inClassDef = false;
        let lastFieldLineIndex = -1;
        let classDefIndex = -1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (classDefRegex.test(line)) {
                inClassDef = true;
                classDefIndex = i;
                continue;
            }

            if (inClassDef) {
                if (endClassSectionRegex.test(line.trim())) {
                    break; // We've reached the end of the fields section
                }
                if (line.trim().match(/^\w+\s*:\s*\w+;/)) {
                    lastFieldLineIndex = i;
                }
            }
        }

        if (lastFieldLineIndex !== -1) {
            const lastLine = lines[lastFieldLineIndex];
            const indentation = lastLine.match(/^\s*/)?.[0] || '    ';
            const declaration = `${indentation}${name}: ${type};`;
            lines.splice(lastFieldLineIndex + 1, 0, declaration);
            return lines.join('\n');
        } else if (classDefIndex !== -1) {
            const indentation = '    ';
            const declaration = `${indentation}${name}: ${type};`;
            lines.splice(classDefIndex + 1, 0, declaration);
            return lines.join('\n');
        }
        
        return pasCode;
      };

      const newPas = addComponentToPas(pasContent, newName, componentType);

      setProjectFiles(prev => ({...prev, [formDfmFile]: newDfm, [formPasFile]: newPas }));
      setActiveEditorView('design');
      setTimeout(() => setSelectedComponentId(newName), 100);
  };

  const handleComponentUpdate = useCallback((id: string, updates: Record<string, any>) => {
    const formDfmFile = activeFile.replace('.pas', '.dfm');
    if (projectFiles[formDfmFile]) {
      const newDfm = updateDfmProperties(projectFiles[formDfmFile], id, updates);
      setProjectFiles(prev => ({...prev, [formDfmFile]: newDfm }));
    }
  }, [projectFiles, activeFile]);

  const handlePropertyChange = (prop: string, value: string) => {
    if (!selectedComponentId) return;
    const formDfmFile = activeFile.replace('.pas', '.dfm');
     if (projectFiles[formDfmFile]) {
        const newDfm = updateDfmProperties(projectFiles[formDfmFile], selectedComponentId, {[prop]: value});
        setProjectFiles(prev => ({...prev, [formDfmFile]: newDfm}));
     }
  };
  
  const handleCreateEventHandler = (componentId: string, eventName: string) => {
    if (!componentId) return;

    const formPasFile = activeFile;
    const formDfmFile = activeFile.replace('.pas', '.dfm');
    
    if (!projectFiles[formDfmFile] || !projectFiles[formPasFile]) return;

    const procedureName = `${componentId}${eventName.replace('On', '')}`;
    
    let pasCode = projectFiles[formPasFile];
    if (pasCode.includes(`procedure TForm1.${procedureName}(Sender: TObject);`)) {
        setOutput(`O manipulador de evento '${procedureName}' já existe.`);
        setActiveFile(formPasFile);
        return;
    }

    // 1. Add to DFM
    const newDfm = updateDfmProperties(projectFiles[formDfmFile], componentId, {[eventName]: procedureName});

    // 2. Add declaration to PAS interface
    const typeEndRegex = /(type\s+TForm\d*\s*=\s*class\(TForm\)[^]*(?=private|public|protected|end;))/i;
    const match = pasCode.match(typeEndRegex);
    if (match) {
        const insertPoint = match.index! + match[0].length;
        const declaration = `    procedure ${procedureName}(Sender: TObject);\n`;
        pasCode = pasCode.slice(0, insertPoint) + declaration + pasCode.slice(insertPoint);
    }

    // 3. Add implementation to PAS
    const implEndRegex = /end\.\s*$/;
    const implMatch = pasCode.match(implEndRegex);
    if (implMatch) {
        const implPoint = implMatch.index!;
        const implementation = `
procedure TForm1.${procedureName}(Sender: TObject);
begin
  
end;

`;
        pasCode = pasCode.slice(0, implPoint) + implementation + pasCode.slice(implPoint);
    }
    
    setProjectFiles(prev => ({ ...prev, [formDfmFile]: newDfm, [formPasFile]: pasCode }));
    setOutput(`Manipulador de evento '${procedureName}' criado com sucesso.`);
    setActiveFile(formPasFile);
    setActiveEditorView('code');
  }

  const currentDfmForPas = projectFiles[activeFile.replace('.pas', '.dfm')];
  const currentDfmFile = currentDfmForPas || Object.entries(projectFiles).find(([name]) => name.endsWith('.dfm'))?.[1] || '';
  const allComponents = parseDfm(currentDfmFile);
  const flatComponents = flattenDfmComponents(allComponents);
  const selectedComponent = selectedComponentId ? flatComponents.find(c => c.id === selectedComponentId) : null;
  
  const inspectorProperties = selectedComponent ? {
    Name: selectedComponent.id, ...selectedComponent.properties
  } : null;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 font-sans overflow-hidden">
        {isNewModalOpen && <NewItemModal onCreate={handleCreateNew} onClose={() => setIsNewModalOpen(false)} />}
      <header className="bg-gray-800 shadow-md px-2 flex items-center justify-between border-b border-gray-700 flex-shrink-0 z-20 h-10">
        <div className="flex items-center space-x-3">
          <DelphiLogo />
          <h1 className="text-lg font-bold text-white">Delphi Online IDE</h1>
        </div>
      </header>
      
       <div className="bg-gray-800 p-1 flex items-center space-x-2 border-b border-gray-700 flex-shrink-0">
            <button title="Novo" onClick={() => setIsNewModalOpen(true)} disabled={isLoading} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"><FileIcon /></button>
            <button title="Carregar Projeto" onClick={handleLoad} disabled={isLoading} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"><FolderOpenIcon /></button>
            <button title="Salvar Projeto" onClick={handleSave} disabled={isLoading} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"><SaveIcon /></button>
            <button title="Download do Projeto (.zip)" onClick={handleDownloadProject} disabled={isLoading} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"><DownloadIcon /></button>
            <div className="w-px h-6 bg-gray-600 mx-1"></div>
            <button title="Executar (F9)" onClick={handleRun} disabled={isLoading} className="flex items-center p-2 text-green-400 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors">
                {loadingAction === 'run' ? <SpinnerIcon /> : <PlayIcon />}
            </button>
            <button title="Compilar" onClick={handleCompile} disabled={isLoading} className="flex items-center p-2 text-blue-400 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors">
                {loadingAction === 'compile' ? <SpinnerIcon /> : <HammerIcon />}
            </button>
            <div className="w-px h-6 bg-gray-600 mx-1"></div>
             <button title="Formatar Código" onClick={handleFormat} disabled={isLoading} className="flex items-center p-2 text-purple-400 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors">
                {loadingAction === 'format' ? <SpinnerIcon /> : <SparklesIcon />}
            </button>
             <button title="Analisar Código" onClick={handleAnalyze} disabled={isLoading} className="flex items-center p-2 text-yellow-400 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors">
                {loadingAction === 'analyze' ? <SpinnerIcon /> : <AnalyzeIcon />}
            </button>
       </div>

      <div ref={mainContainerRef} className="flex flex-grow overflow-hidden">
        {/* Left Panel */}
        <div style={{width: `${leftPanelWidth}px`}} className="flex-shrink-0 bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Structure & Inspector Panel */}
            <div className="flex-grow flex flex-col overflow-hidden">
                 <div className="flex items-center h-8 bg-gray-900/50 flex-shrink-0 justify-between border-b border-gray-700">
                     <div className='flex'>
                        <button onClick={() => setLeftPanelTab('structure')} className={`px-3 py-1 text-sm flex items-center gap-1 ${leftPanelTab === 'structure' ? 'bg-gray-800' : 'bg-transparent text-gray-400 hover:bg-gray-700/50'}`}>
                            <StructureIcon/> Estrutura
                        </button>
                        <button onClick={() => setLeftPanelTab('inspector')} className={`px-3 py-1 text-sm flex items-center gap-1 ${leftPanelTab === 'inspector' ? 'bg-gray-800' : 'bg-transparent text-gray-400 hover:bg-gray-700/50'}`}>
                            <InspectorIcon/> Inspetor
                        </button>
                     </div>
                </div>
                {leftPanelTab === 'structure' && (
                    <StructureTreeView 
                        components={allComponents}
                        selectedId={selectedComponentId}
                        onSelect={setSelectedComponentId}
                    />
                )}
                {leftPanelTab === 'inspector' && (
                    <ObjectInspector 
                        component={selectedComponent}
                        onPropertyChange={handlePropertyChange}
                        onCreateEventHandler={handleCreateEventHandler}
                    />
                )}
            </div>
        </div>

        <div className="resizable-handle-x" onMouseDown={(e) => handleMouseDownX(e, 'left')}></div>
        
        <main className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow flex flex-col bg-gray-800 rounded-lg shadow-inner border border-gray-700 overflow-hidden m-2 mb-0 min-h-0">
            <div className="bg-gray-900/50 flex-shrink-0 flex items-end">
                <button 
                    onClick={() => setActiveEditorView('code')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeEditorView === 'code' ? 'border-blue-400 text-white' : 'border-transparent text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    >
                    Código
                </button>
                <button 
                    onClick={() => setActiveEditorView('design')}
                    disabled={!hasDfmForActiveFile}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeEditorView === 'design' ? 'border-blue-400 text-white' : 'border-transparent text-gray-400 hover:bg-gray-700 hover:text-white'} disabled:text-gray-600 disabled:cursor-not-allowed`}
                    >
                    Design
                </button>
                <span className="text-xs text-gray-500 self-center ml-auto mr-4">{activeFile}</span>
            </div>
            <div className="relative w-full flex-grow flex flex-col min-h-0">
              {activeEditorView === 'design' && hasDfmForActiveFile ? (
                  <FormPreview 
                    dfmCode={projectFiles[activeFile.replace('.pas', '.dfm')]} 
                    onSelectComponent={setSelectedComponentId} 
                    selectedComponentId={selectedComponentId}
                    onDrop={handleAddComponent}
                    onComponentUpdate={handleComponentUpdate}
                  />
              ) : (
                  <Editor
                    value={projectFiles[activeFile] || ''}
                    onValueChange={handleCodeChange}
                    highlight={code => Prism.highlight(code, Prism.languages.pascal, 'pascal')}
                    padding={16}
                    textareaId="code-editor"
                    className="code-editor"
                    spellCheck="false"
                  />
              )}
            </div>
          </div>
          
          <div onMouseDown={handleMouseDownY} className="h-2 cursor-row-resize hover:bg-blue-500 transition-colors flex-shrink-0 mx-2"></div>

          <div style={{ height: `${outputHeight}px` }} className="flex-shrink-0 flex flex-col bg-gray-800 rounded-lg shadow-inner border border-gray-700 m-2 mt-0">
            <div className="flex justify-between items-center border-b border-gray-700">
              <div className="flex">
                  <button onClick={() => setActiveTab(OutputType.MESSAGES)} className={`px-4 py-2 text-sm font-medium ${activeTab === OutputType.MESSAGES ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>Mensagens</button>
                  <button onClick={() => setActiveTab(OutputType.CONSOLE)} className={`px-4 py-2 text-sm font-medium ${activeTab === OutputType.CONSOLE ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>Console</button>
              </div>
              <button title="Limpar Saída" onClick={() => setOutput('')} className="mr-2 p-1 rounded hover:bg-gray-600"><TrashIcon /></button>
            </div>
            <div className="flex-grow p-4 overflow-auto">
              {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded relative mb-4" role="alert"><strong className="font-bold">Erro! </strong><span className="block sm:inline">{error}</span></div>}
              <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        </main>

        <div className="resizable-handle-x" onMouseDown={(e) => handleMouseDownX(e, 'right')}></div>

        {/* Right Panel */}
         <div style={{width: `${rightPanelWidth}px`}} className="flex-shrink-0 bg-gray-800 border-l border-gray-700 flex flex-col">
             {/* Project Explorer */}
            <div style={{ height: `${rightPanelTopHeight}px` }} className="flex flex-col overflow-hidden">
                <div className="flex items-center justify-between h-8 bg-gray-900/50 px-2 flex-shrink-0 border-b border-gray-700">
                    <h2 className="font-bold text-sm flex items-center gap-2"><ProjectIcon/> Projeto</h2>
                </div>
                <div className="p-2 overflow-y-auto flex-grow">
                   <ProjectExplorer 
                      files={Object.keys(projectFiles).sort()}
                      activeFile={activeFile}
                      onSelectFile={setActiveFile}
                   />
                </div>
            </div>

            <div onMouseDown={handleMouseDownRightY} className="h-2 cursor-row-resize hover:bg-blue-500 transition-colors flex-shrink-0"></div>

            {/* Component Palette */}
            <div className="flex-grow flex flex-col overflow-hidden">
                <div className="flex items-center justify-between h-8 bg-gray-900/50 px-2 flex-shrink-0">
                    <h2 className="font-bold text-sm flex items-center gap-2"><PaletteIcon/> Componentes</h2>
                </div>
                <div className="p-2 overflow-y-auto flex-grow">
                    {Object.entries(componentPalette.reduce((acc, comp) => {
                        if (!acc[comp.category]) acc[comp.category] = [];
                        acc[comp.category].push(comp);
                        return acc;
                    }, {} as Record<string, typeof componentPalette>)).map(([category, components]) => (
                        <div key={category} className="mb-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">{category}</h3>
                            {components.map(comp => (
                                <button key={comp.name} draggable onDragStart={(e) => e.dataTransfer.setData('componentType', comp.name)} className="w-full flex items-center space-x-2 p-1 rounded hover:bg-gray-700 text-left cursor-grab">
                                    {comp.icon}
                                    <span className="text-sm">{comp.name}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

const alignableComponents = [
    'TButton', 'TLabel', 'TEdit', 'TPanel', 'TCheckBox', 'TMemo', 
    'TComboBox', 'TRadioGroup', 'TGroupBox', 'TImage', 'TStringGrid'
];

const ObjectInspector = ({ component, onPropertyChange, onCreateEventHandler }: { component: DfmComponent | null, onPropertyChange: (prop: string, value: string) => void, onCreateEventHandler: (componentId: string, eventName: string) => void }) => {
    const [activeTab, setActiveTab] = useState<'properties' | 'events'>('properties');
    if (!component) return <p className="p-4 text-xs text-gray-500">Selecione um componente para ver suas propriedades.</p>;

    const properties: { Name: string; [key: string]: any } = { Name: component.id, ...component.properties };
    const events = componentEvents[component.type] || componentEvents[component.type.replace(/\d+$/, '')] || [];
    const alignOptions = ['alNone', 'alTop', 'alBottom', 'alLeft', 'alRight', 'alClient'];
    const supportsAlign = alignableComponents.includes(component.type);

    const renderPropertyInput = (key: string, value: any) => (
        <div key={key} className="grid grid-cols-2 gap-2 items-center">
            <label htmlFor={key} className="text-xs text-gray-400 truncate">{key}</label>
            <input
                id={key}
                type={typeof value === 'number' ? 'number' : 'text'}
                value={value as any}
                onChange={(e) => onPropertyChange(key, e.target.value)}
                disabled={key === 'Name'}
                className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
        </div>
    );

    const renderAlignSelector = () => (
        <div key="Align" className="grid grid-cols-2 gap-2 items-center">
            <label htmlFor="Align" className="text-xs text-gray-400 truncate">Align</label>
            <select
                id="Align"
                value={(properties.Align as string) || 'alNone'}
                onChange={(e) => onPropertyChange('Align', e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                {alignOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    const otherProperties = Object.entries(properties)
        .filter(([key]) => !['children', 'parent', 'Name', 'Align'].includes(key))
        .sort(([a], [b]) => a.localeCompare(b));

    return (
        <div className="flex flex-col flex-grow overflow-hidden">
            <div className='bg-gray-700 p-2 rounded m-2 flex-shrink-0'>
                <p className='text-sm font-bold'>{properties.Name}: {component?.type}</p>
            </div>
            <div className="flex border-b border-t border-gray-700 flex-shrink-0">
                <button onClick={() => setActiveTab('properties')} className={`flex-1 py-1 text-sm ${activeTab === 'properties' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}>Propriedades</button>
                <button onClick={() => setActiveTab('events')} className={`flex-1 py-1 text-sm ${activeTab === 'events' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}>Eventos</button>
            </div>
            <div className="p-2 space-y-2 overflow-y-auto flex-grow">
                {activeTab === 'properties' && (
                    <>
                        {renderPropertyInput('Name', properties.Name)}
                        {supportsAlign && renderAlignSelector()}
                        {otherProperties.map(([key, value]) => renderPropertyInput(key, value))}
                    </>
                )}
                {activeTab === 'events' && events.map(eventName => (
                    <div key={eventName} className="grid grid-cols-2 gap-2 items-center">
                         <label htmlFor={eventName} className="text-xs text-gray-400 truncate">{eventName}</label>
                         <input
                            id={eventName}
                            type="text"
                            defaultValue={properties[eventName] as string || ''}
                            onDoubleClick={() => onCreateEventHandler(component.id, eventName)}
                            placeholder='<duplo clique>'
                            readOnly
                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};