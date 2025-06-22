import csv

# Eingabedatei und Ausgabedatei festlegen
input_file = 'routes.txt'
output_file = 'routes_filter.txt'

# Öffne die Eingabedatei zum Lesen und die Ausgabedatei zum Schreiben
with open(input_file, 'r', encoding='utf-8') as infile, open(output_file, 'w', encoding='utf-8', newline='') as outfile:
    reader = csv.reader(infile, delimiter=',')
    writer = csv.writer(outfile, delimiter=',')
    
    header = next(reader)  # Header lesen
    writer.writerow(header)  # Header in die neue Datei schreiben
    
    # Die filterbaren Route-Typen
    allowed_route_types = ['109', '106', '103', '102']
    
    # Alle Zeilen der Eingabedatei durchgehen
    for row in reader:
        route_id, agency_id, route_short_name, route_long_name, route_desc, route_type = row
        # Nur die Zeilen schreiben, die einen erlaubten route_type haben
        if route_type in allowed_route_types:
            writer.writerow(row)

# Ausgabe der ersten 5 Zeilen der gefilterten Datei
with open(output_file, 'r', encoding='utf-8') as outfile:
    for i in range(5):
        print(outfile.readline().strip())
