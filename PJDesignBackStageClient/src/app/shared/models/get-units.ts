export class GetUnitsResponse {
  id: number;
  name: string;
  url?: string;
  isAnotherWindow: boolean;
  parent: number;
  type: number;
  children?: GetUnitsResponse[];
}
