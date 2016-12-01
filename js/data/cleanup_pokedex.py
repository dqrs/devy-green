import json

with open('unfiltered_pokedex.json', 'r') as pokefile:
  pokedex = json.load(pokefile)
  filtered = []

  for i in range(151):
    listing = {}
    listing['name'] = pokedex[i]['ename']
    listing['attack'] = pokedex[i]['base']['Attack']
    listing['defense'] = pokedex[i]['base']['Attack']
    listing['hp'] = pokedex[i]['base']['Attack']
    listing['speed'] = pokedex[i]['base']['Attack']

    filtered.append(listing)

  with open('filtered_pokedex.js', 'w') as outfile:
    outfile.write(json.dumps(filtered, indent=4, sort_keys=True))