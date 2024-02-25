import { Data } from '../interfaces.js'
  
  export const createInMemoryDB = <T extends Data>() => {
    const idMap = new Map<number, T>();
  
    const create = (data: T): T => {
      const item = { ...data };
      idMap.set(item.id, item);
      return item;
    };
  
    const find = (id: number): T | null => idMap.get(id) ?? null;
  
    const findFirst = (field: keyof T, value: unknown): T | null => {
      for (const item of findAll()) {
        if (item[field] === value) return item;
      }
      return null;
    };
  
    const findMany = (field: keyof T, value: unknown): T[] => {
      const items: T[] = [];
      for (const item of findAll()) {
        if (item[field] === value) items.push(item);
      }
      return items;
    };
  
    const findAll = () => Array.from(idMap.values());
  
    const update = (id: number, data: Partial<T>): T | null => {
      const item = deleteItem(id);
      if (!item) return null;
      return create({ ...item, ...data });
    };
  
    const deleteItem = (id: number): T | null => {
      const item = find(id);
      if (!item) return null;
      idMap.delete(id);
      return item;
    };
  
    return {
      create,
      find,
      findFirst,
      findMany,
      findAll,
      update,
      deleteItem,
    };
  };