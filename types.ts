
export enum TabType {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export interface LegalQueryResponse {
  answer: string;
  disclaimer: string;
}
