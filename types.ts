export enum OutputType {
  MESSAGES = 'MESSAGES',
  CONSOLE = 'CONSOLE',
}

export type DfmComponent = {
  id: string;
  type: string;
  properties: Record<string, string | number>;
  children: DfmComponent[];
  parent: DfmComponent | null;
};
