DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tc.table_name, tc.constraint_name 
              FROM information_schema.table_constraints tc 
              WHERE tc.constraint_type = 'FOREIGN KEY') 
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
END $$; 