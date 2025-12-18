
import Dexie, { Table } from 'dexie';

export interface Account {
  id?: number;
  cuenta: string; // 4 digits
  subcuenta: string; // 4 digits
  clasificacion: string;
  timestamp: number;
}

export interface JournalEntryLine {
  accountId: number;
  accountLabel: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id?: number;
  description: string;
  lines: JournalEntryLine[];
  timestamp: number;
}

export interface Supplier {
  id?: number;
  numeroProveedor: string; // 4 digits
  nombreProveedor: string;
  clasificacion: string;
  timestamp: number;
}

export interface Invoice {
  id?: number;
  supplierId: number;
  numeroFactura: string;
  fechaFactura: string;
  description: string;
  amount: number;
  timestamp: number;
}

export interface Center {
  id?: number;
  name: string;
  type: 'Central' | 'Delegación' | 'Centro Asociado' | 'Otros';
  parentId: number | null;
  timestamp: number;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  roleId: number;
  timestamp: number;
}

export interface Role {
  id?: number;
  name: string;
  timestamp: number;
}

export class ERPDatabase extends Dexie {
  accounts!: Table<Account>;
  journalEntries!: Table<JournalEntry>;
  suppliers!: Table<Supplier>;
  invoices!: Table<Invoice>;
  centers!: Table<Center>;
  users!: Table<User>;
  roles!: Table<Role>;

  constructor(databaseName: string = 'ERPappDB') {
    super(databaseName);
    // Fix: Using any cast to access Dexie version method which might be missing from type definitions in some environments
    (this as any).version(1).stores({
      accounts: '++id, cuenta, subcuenta, clasificacion, timestamp',
      journalEntries: '++id, timestamp',
      suppliers: '++id, numeroProveedor, nombreProveedor, clasificacion, timestamp',
      invoices: '++id, supplierId, numeroFactura, fechaFactura, timestamp',
      centers: '++id, name, type, parentId, timestamp',
      users: '++id, username, email, roleId, timestamp',
      roles: '++id, name, timestamp',
    });
  }
}

export const db = new ERPDatabase();

// Seed initial data if empty
export const seedDatabase = async () => {
  const accountCount = await db.accounts.count();
  if (accountCount === 0) {
    await db.roles.bulkAdd([
      { name: 'Administrador', timestamp: Date.now() },
      { name: 'Contador', timestamp: Date.now() },
      { name: 'Finanzas', timestamp: Date.now() },
    ]);
    
    await db.users.add({
      username: 'admin',
      email: 'admin@erpapp.local',
      roleId: 1,
      timestamp: Date.now()
    });

    await db.accounts.bulkAdd([
      { cuenta: '1000', subcuenta: '0001', clasificacion: 'Activo', timestamp: Date.now() },
      { cuenta: '4000', subcuenta: '0001', clasificacion: 'Pasivo', timestamp: Date.now() },
      { cuenta: '6000', subcuenta: '0001', clasificacion: 'Gasto', timestamp: Date.now() },
    ]);

    await db.centers.add({
      name: 'Sede Principal',
      type: 'Central',
      parentId: null,
      timestamp: Date.now()
    });
  }
};
