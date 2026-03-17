
import React from 'react';

export const HammerIcon = (): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.25 7.46L8.51 14.2a2.25 2.25 0 01-3.18 0l-.07-.07a2.25 2.25 0 010-3.18l6.74-6.74a2.25 2.25 0 013.18 0l.07.07a2.25 2.25 0 010 3.18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-2.25 2.25" />
  </svg>
);

export const PlayIcon = (): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);

export const SpinnerIcon = (): React.ReactElement => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const SaveIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586L7.707 10.293zM3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
        <path d="M15 9a1 1 0 00-1 1v5a1 1 0 01-1 1H7a1 1 0 01-1-1v-5a1 1 0 00-2 0v5a3 3 0 003 3h6a3 3 0 003-3v-5a1 1 0 00-1-1z" />
    </svg>
);

export const FolderOpenIcon = (): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H2V6z" clipRule="evenodd" />
    <path d="M2 12a2 2 0 00-2 2v2a2 2 0 002 2h16a2 2 0 002-2v-2a2 2 0 00-2-2H2z" />
  </svg>
);

export const FileIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 4a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1H5z" clipRule="evenodd" />
    </svg>
);

export const SparklesIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.586 2.586a2 2 0 012.828 0l.001.001 1.414 1.414a2 2 0 010 2.828l-10 10a2 2 0 01-2.828 0l-1.414-1.414a2 2 0 010-2.828l10-10zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        <path d="M5 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm1 12a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm6-1a1 1 0 00-1-1H9a1 1 0 100 2h2a1 1 0 001-1zm1 5a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
    </svg>
);

export const TrashIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

export const DelphiLogo = (): React.ReactElement => (
    <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#EF4444', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor: '#F87171', stopOpacity:1}} />
            </linearGradient>
        </defs>
        <path fill="url(#grad1)" d="M50,5 L95,27.5 L95,72.5 L50,95 L5,72.5 L5,27.5 Z M50,15 L85,32.5 L85,67.5 L50,85 L15,67.5 L15,32.5 Z" />
        <path fill="#ffffff" d="M42,30 L58,30 L58,70 L42,70 L42,58 L50,58 L50,42 L42,42 Z" />
    </svg>
);

export const DownloadIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 12a2 2 0 00-2 2v2a2 2 0 002 2h16a2 2 0 002-2v-2a2 2 0 00-2-2H2z" />
        <path d="M10 2a1 1 0 00-1 1v7.586l-2.293-2.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 10-1.414-1.414L11 10.586V3a1 1 0 00-1-1z" />
    </svg>
);

export const PaletteIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

export const InspectorIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 4a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1V8zm-1 5a1 1 0 000 2h12a1 1 0 100-2H5z" clipRule="evenodd" />
    </svg>
);

export const DprIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-red-400"><path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 12.5 2h-9ZM3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9Zm3.25 1a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM7.75 4a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0V4.75a.75.75 0 0 1 .75-.75Zm2.25.75a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z" clipRule="evenodd"></path></svg>
);
export const PasIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-blue-400"><path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 12.5 2h-9ZM3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9Zm3.25 1a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5ZM6 7.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 6 7.25Zm-1.25 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd"></path></svg>
);
export const DfmIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-teal-400"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.5A1.5 1.5 0 0 0 2.5 6h11A1.5 1.5 0 0 0 15 4.5v-.5A1.5 1.5 0 0 0 13.5 3h-11ZM2 4.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-.5Z"></path><path d="M4.75 8a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 4.75 8Zm0 3a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Z"></path></svg>
);

export const ProjectIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 12.5 2h-9ZM3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9Z"></path><path d="M4 5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-5Z"></path></svg>
);


export const ButtonIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h7A1.5 1.5 0 0 1 13 5.5v5A1.5 1.5 0 0 1 11.5 12h-7A1.5 1.5 0 0 1 3 10.5v-5ZM4.5 5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-7Z"></path></svg>
);

export const EditIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M13 3.5H3v-1h10v1ZM3 13.5h10v-1H3v1Z" clipRule="evenodd"></path><path d="M4.031 5.219a.75.75 0 0 1 .719-.531H11.25a.75.75 0 0 1 .75.75v5.062a.75.75 0 0 1-.75.75H4.75a.75.75 0 0 1-.719-.969l.344-1.156a.75.75 0 0 0-.5-1.031.75.75 0 0 1 .156-1.407l.344.156a.75.75 0 0 0 .875-.5l.156-.344a.75.75 0 0 1 1.25-.156l.5.875a.75.75 0 0 0 .688.406H10a.75.75 0 0 0 .5-.219.75.75 0 0 1 .906-.312.75.75 0 0 0 .22-.094V5.438a.75.75 0 0 1-.906-.313.75.75 0 0 0-1.094-.156L7.5 5.5a.75.75 0 0 1-.688-.406L6.5 4.5a.75.75 0 0 0-.875-.5l-.344.156a.75.75 0 0 1-.906-.313.75.75 0 0 0-1.094-.156L3.5 4.5a.75.75 0 0 1-.312.906.75.75 0 0 0-.094.22L3.5 6.5a.75.75 0 0 0 .406.688l.875.5a.75.75 0 0 1 .156 1.25l-.344.156a.75.75 0 0 0-.5.875l.156.344a.75.75 0 0 1-.156.906.75.75 0 0 0 .22.094l1.156-.344a.75.75 0 0 1 .719.53Z"></path></svg>
);

export const LabelIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.5 3A1.5 1.5 0 0 0 2 4.5v2.75a.75.75 0 0 0 1.5 0V4.5a.5.5 0 0 1 .5-.5h2.75a.75.75 0 0 0 0-1.5H3.5ZM10.25 3a.75.75 0 0 0 0 1.5H13a.5.5 0 0 1 .5.5v2.75a.75.75 0 0 0 1.5 0V4.5A1.5 1.5 0 0 0 13.5 3h-3.25ZM3.5 10.25a.75.75 0 0 0-1.5 0V13a.5.5 0 0 0 .5.5h2.75a.75.75 0 0 0 0-1.5H3.25a.5.5 0 0 1-.25-.434V10.25ZM12.75 10.25a.75.75 0 0 0-1.5 0v2.016a.5.5 0 0 1-.25.434H8.25a.75.75 0 0 0 0 1.5h3.25A1.5 1.5 0 0 0 13 13.5v-3.25Z"></path><path d="M5.22 8.22a.75.75 0 0 0 1.06 1.06L8 7.56l1.72 1.72a.75.75 0 1 0 1.06-1.06L9.06 6.5l1.72-1.72a.75.75 0 0 0-1.06-1.06L8 5.44 6.28 3.72a.75.75 0 0 0-1.06 1.06L6.94 6.5 5.22 8.22Z"></path></svg>
);

export const PanelIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h7A1.5 1.5 0 0 1 13 3.5v9A1.5 1.5 0 0 1 11.5 14h-7A1.5 1.5 0 0 1 3 12.5v-9ZM4.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-7Z"></path><path d="M3.75 4.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z"></path></svg>
);

export const CheckboxIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9A1.5 1.5 0 0 0 14 12.5v-9A1.5 1.5 0 0 0 12.5 2h-9ZM3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9Z"></path><path d="m6.518 7.482.023.023L8 9.02l3.459-3.541a.75.75 0 0 1 1.082 1.04l-4 4.125a.75.75 0 0 1-1.082 0l-2.5-2.5a.75.75 0 1 1 1.04-1.082Z"></path></svg>
);

export const AnalyzeIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M10.5 7a.5.5 0 01.5.5v2a.5.5 0 01-1 0V7.5a.5.5 0 01.5-.5zM10 12a.5.5 0 01.5-.5h.01a.5.5 0 010 1H10.5a.5.5 0 01-.5-.5z" clipRule="evenodd" />
    </svg>
);

export const DataSourceIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M8 1a2 2 0 0 0-2 2v1.17a3.001 3.001 0 0 0 0 5.66V13a2 2 0 0 0 2 2h.01a2 2 0 0 0 2-2V9.83a3.001 3.001 0 0 0 0-5.66V3a2 2 0 0 0-2-2H8Zm2 7.17v4.33a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8.17a3.001 3.001 0 1 0 3 0ZM9 5a2 2 0 1 0-2 2 2 2 0 0 0 2-2Z"/></svg>
);

export const MemoIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M2.5 2A1.5 1.5 0 0 0 1 3.5v9A1.5 1.5 0 0 0 2.5 14h11A1.5 1.5 0 0 0 15 12.5v-9A1.5 1.5 0 0 0 13.5 2h-11ZM2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-9Z"></path><path d="M4 5.75a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H4ZM4 8.25a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H4ZM4 10.75a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5H4Z"></path></svg>
);

export const ComboBoxIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H12v-1H3.5a.5.5 0 0 0-.5.5v.5h-9a.5.5 0 0 1-.5-.5v-9A.5.5 0 0 1 3.5 3h9a.5.5 0 0 1 .5.5V4h1V3.5A1.5 1.5 0 0 0 12.5 2h-9Z"></path><path d="M10.78 6.22a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06L8 7.94l1.72-1.72a.75.75 0 0 1 1.06 0Z"></path><path d="M3.5 5h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5Z"></path></svg>
);

export const MenuIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.5A1.5 1.5 0 0 0 2.5 6h11A1.5 1.5 0 0 0 15 4.5v-.5A1.5 1.5 0 0 0 13.5 3h-11ZM2 4.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-.5Z"></path><path d="M4.75 8a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 4.75 8Zm0 3a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Z"></path></svg>
);

export const RadioGroupIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9A1.5 1.5 0 0 0 14 12.5v-9A1.5 1.5 0 0 0 12.5 2h-9ZM3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9Z"></path><path d="M5 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM8 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path><path d="M9.5 5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2Zm0 5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2Z"></path></svg>
);

export const GroupBoxIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9A1.5 1.5 0 0 0 14 12.5v-9A1.5 1.5 0 0 0 12.5 2h-9ZM3 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V4h-3V3.5ZM6 4h6.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V4h3Z"></path></svg>
);

export const ImageIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M2.5 2A1.5 1.5 0 0 0 1 3.5v9A1.5 1.5 0 0 0 2.5 14h11A1.5 1.5 0 0 0 15 12.5v-9A1.5 1.5 0 0 0 13.5 2h-11ZM2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-9Z"></path><path d="M10.56 5.56a.75.75 0 0 0-1.06-1.06l-3.25 3.25L5.19 6.69a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.06 0l4-4Z"></path><path d="M11.5 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path></svg>
);

export const StringGridIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
        <path d="M2.5 2A1.5 1.5 0 0 0 1 3.5v9A1.5 1.5 0 0 0 2.5 14h11A1.5 1.5 0 0 0 15 12.5v-9A1.5 1.5 0 0 0 13.5 2h-11ZM2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-9Z" />
        <path d="M2 6h12v1H2V6zm0 3h12v1H2V9zm4-7v12h1V2H6zm3 0v12h1V2H9z" />
    </svg>
);

export const StructureIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9A1.5 1.5 0 0 1 12.5 14h-9A1.5 1.5 0 0 1 2 12.5v-9ZM3.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-9Z" clipRule="evenodd"></path><path d="M8.5 4.75a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"></path></svg>
);

export const SupabaseConnectionIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-green-400">
        <path d="M8 1a2 2 0 0 0-2 2v1.17a3.001 3.001 0 0 0 0 5.66V13a2 2 0 0 0 2 2h.01a2 2 0 0 0 2-2V9.83a3.001 3.001 0 0 0 0-5.66V3a2 2 0 0 0-2-2H8Zm2 7.17v4.33a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8.17a3.001 3.001 0 1 0 3 0ZM9 5a2 2 0 1 0-2 2 2 2 0 0 0 2-2Z"/>
        <path d="M13.25 8a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5h1.5Z" />
        <path fillRule="evenodd" d="M15 8a2 2 0 0 1-2 2H3a2 2 0 1 1 0-4h1.75a.75.75 0 0 1 0 1.5H3a.5.5 0 0 0 0 1h10a.5.5 0 0 0 .5-.5V8a2 2 0 0 1 1.5-1.932V8Z" clipRule="evenodd" />
    </svg>
);

export const SupabaseTableIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-green-400">
        <path d="M3 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3Zm0-1.5a2.5 2.5 0 0 0-2.5 2.5v8a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 13 1.5H3Z" />
        <path d="M3 6.5a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1H3ZM6.5 3a.5.5 0 0 0-1 0v10a.5.5 0 0 0 1 0V3ZM9.5 3a.5.5 0 0 0-1 0v10a.5.5 0 0 0 1 0V3Z"/>
    </svg>
);

export const SupabaseQueryIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-green-400">
        <path fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .75.75v2.316a5.52 5.52 0 0 1 2.221.77l1.635-1.635a.75.75 0 1 1 1.06 1.06L12.03 6.647a5.52 5.52 0 0 1 0 2.706l1.636 1.636a.75.75 0 1 1-1.06 1.06l-1.635-1.635a5.52 5.52 0 0 1-2.22.77V13.5a.75.75 0 0 1-1.5 0v-2.316a5.52 5.52 0 0 1-2.22-.77l-1.636 1.635a.75.75 0 1 1-1.06-1.06l1.635-1.636a5.52 5.52 0 0 1 0-2.706L2.334 5.012a.75.75 0 0 1 1.06-1.06l1.636 1.635a5.52 5.52 0 0 1 2.22-.77V2.5a.75.75 0 0 1 .75-.75ZM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clipRule="evenodd" />
        <path d="M6.274 4.526a4.018 4.018 0 0 0-1.59 1.59l-.008.016a.75.75 0 0 1-1.332-.664l.008-.016a5.518 5.518 0 0 1 2.18-2.18l.016-.008a.75.75 0 1 1 .664 1.332l-.016.008-.323.16Z" />
    </svg>
);

export const SupabaseTransactionIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-green-400">
        <path d="M8 1a2 2 0 0 0-2 2v1.17a3.001 3.001 0 0 0 0 5.66V13a2 2 0 0 0 2 2h.01a2 2 0 0 0 2-2V9.83a3.001 3.001 0 0 0 0-5.66V3a2 2 0 0 0-2-2H8Zm2 7.17v4.33a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8.17a3.001 3.001 0 1 0 3 0ZM9 5a2 2 0 1 0-2 2 2 2 0 0 0 2-2Z"/>
        <path d="M12.75 2a.75.75 0 0 0-1.06 0L9.81 3.88a.75.75 0 1 0 1.06 1.06L12.75 3.06l1.88 1.88a.75.75 0 1 0 1.06-1.06L13.81 2a.75.75 0 0 0-1.06 0Z"/>
        <path d="M15.5 5.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1 0-1.5h3.5a.75.75 0 0 1 .75.75Z"/>
    </svg>
);
