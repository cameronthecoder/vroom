// migrate.ts
import { db } from './db'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { FileMigrationProvider, Migrator } from 'kysely'

async function main() {

    console.log(path.join(process.cwd(), '/app/server/db/migrations'));

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.join(process.cwd(), '/app/server/db/migrations/'),
        }),
    })

    console.log('Found files:', await fs.readdir(path.join(process.cwd(), '/app/server/db/migrations/')))

    const { error, results } = await migrator.migrateToLatest()

    console.log(results);
    

    results?.forEach(r => {
        if (r.status === 'Success') console.log(`✅ ${r.migrationName}`)
        else if (r.status === 'Error') console.error(`❌ ${r.migrationName}`)
    })

    if (error) {
        console.error('Migration failed', error)
        process.exit(1)
    }
    await db.destroy()
}

main()
