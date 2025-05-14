import exportFromJson from "export-from-json"

export const EXPORT_FILE_FORMATS = Object.keys(exportFromJson.types).filter(f => !(['css', 'html'].includes(f)))
export type FileFormat =  Exclude<keyof typeof exportFromJson.types, 'css' | 'html' >
export type BasicType = string | number | boolean

export type NAString = 'NA' | 'N/A' | 'NULL' | '.' | '' | 'na' | 'n/a' | 'null'

//  TYPE MAPPING


// for inheriting and modifying an interface or type
// allows overriding and adding to properties when extending an interface or type
// see cell.d.ts for example 
// and the stackoverflow discussion if need to build on this for nested properties
// from https://stackoverflow.com/a/55032655
export type Modify<T, R> = Omit<T, keyof R> & R;

// type mapping function to facilitate linking types
// to meaningful keys, e.g.: cell: CellType
// TypeMapper assumes that the interface or type has a property "type" 
// and creates a mapping T[type]: typeof T
// the allowable keys can then be assigned to a variable
// e.g.
// type CellTypeMapper = TypeMapper<Cells>;
// type CellType = keyof CellTypeMapper
// where CellType = "default" | "numeric" | "boolean" | ...etc
// see cell.d.ts for exampe usage
// https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
export type TypeMapper<T extends { type: string }> = {[t in T as t["type"]]: t}


// VSCode / IntelliSense hack so that properties of expanded types are fully populated
// in info displays; NOTE: This does not resolve auto-complete issues
// expands object types one level deep
// note: may not handle types/interfaces with functions
// see https://stackoverflow.com/a/57683652

// a pull-request exists in the TypeScript IntelliSense plugin to address the autocomplete issue
// see https://github.com/microsoft/TypeScript/issues/49786
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// expands object types recursively (handle nesting)
export type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;

