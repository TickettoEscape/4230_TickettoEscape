import os
import pandas as pd

input_folder = 'filtered_gtfs_data'
output_folder = 'sql_output'

# Create output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

for file_name in os.listdir(input_folder):
    if file_name.endswith('.txt'):
        table_name = file_name.split('.')[0]
        file_path = os.path.join(input_folder, file_name)
        df = pd.read_csv(file_path, delimiter=',', encoding='utf-8')
        sql_file_path = os.path.join(output_folder, f"{table_name}_insert.sql")

        with open(sql_file_path, 'w', encoding='utf-8') as sql_file:
            sql_file.write(f"-- Insert data into table {table_name}\n")
            columns = df.columns.tolist()

            for _, row in df.iterrows():
                sanitized_values = []
                for value in row:
                    if pd.isna(value):
                        sanitized_values.append("NULL")
                    else:
                        escaped_value = str(value).replace("'", "''")  # Escape single quotes for SQL
                        sanitized_values.append(f"'{escaped_value}'")

                values_string = ", ".join(sanitized_values)
                insert_query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({values_string});\n"
                sql_file.write(insert_query)

            sql_file.write("\n")

print("Alle SQL-Dateien wurden erfolgreich im Output-Ordner erstellt.")
