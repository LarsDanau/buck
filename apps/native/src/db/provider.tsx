import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import migrations from "@buck/db/drizzle/migrations";
import { Text, View } from "@/components/primitives";
import { bootstrapDatabase } from "@/db/bootstrap";
import { buckDb, db } from "@/db/client";

interface DatabaseProviderProps {
  readonly children: ReactNode;
}

function DatabaseLoadingState() {
  return (
    <View className="flex-1 py-safe-offset-4 px-8 bg-background">
      <Text>Preparing database...</Text>
    </View>
  );
}

function DatabaseErrorState({ error }: { readonly error: Error }) {
  return (
    <View className="flex-1 py-safe-offset-4 px-8 bg-background">
      <Text>Database startup error: {error.message}</Text>
    </View>
  );
}

/**
 * Runs one-time bootstrap work after migrations complete and exposes the result
 * as regular render state.
 *
 * Migrations are handled by Drizzle's `useMigrations()` hook. Once migrations
 * succeed, this hook starts the bootstrap promise exactly once and reports
 * whether bootstrap data is ready for the app to render against.
 */
function useDatabaseBootstrap(migrationsSucceeded: boolean): {
  readonly isReady: boolean;
  readonly error: Error | null;
} {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!migrationsSucceeded || isReady || error) {
      return;
    }

    let isCancelled = false;

    const runBootstrap = async () => {
      try {
        // Bootstrap data is app-level setup that should run only after schema migrations.
        await bootstrapDatabase();

        if (!isCancelled) {
          setIsReady(true);
        }
      } catch (bootstrapError) {
        if (!isCancelled) {
          setError(
            bootstrapError instanceof Error
              ? bootstrapError
              : new Error("Database bootstrap failed."),
          );
        }
      }
    };

    runBootstrap();

    return () => {
      isCancelled = true;
    };
  }, [error, isReady, migrationsSucceeded]);

  return { isReady, error };
}

/**
 * Provides a fully prepared encrypted local database to the app tree.
 *
 * The database itself is defined once in `client.ts` and can be imported
 * directly. This provider only coordinates readiness by using Drizzle's
 * migration hook and a suspense gate for one-time bootstrap data.
 *
 * @param props Child application tree that requires database access.
 * @returns App tree once the encrypted database is ready.
 */
export function DatabaseProvider({ children }: DatabaseProviderProps) {
  useDrizzleStudio(buckDb);

  const { success: migrationsSucceeded, error: migrationError } = useMigrations(db, migrations);
  const { isReady: bootstrapSucceeded, error: bootstrapError } =
    useDatabaseBootstrap(migrationsSucceeded);

  if (migrationError) {
    return <DatabaseErrorState error={migrationError} />;
  }

  if (bootstrapError) {
    return <DatabaseErrorState error={bootstrapError} />;
  }

  if (!migrationsSucceeded || !bootstrapSucceeded) {
    return <DatabaseLoadingState />;
  }

  return children;
}
