export interface IBodyResult<T>
{
  items: T[];
  totalCount: number;
}

export interface IExtensibleEntityDto {
  extraProperties: Record<string, any>; // A dictionary for extra properties
}

export interface IIdNameDefaultObject extends IExtensibleEntityDto {
  id: string;
  name: string;
  }
