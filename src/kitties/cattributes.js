export const cattributeGenes = [
  // ['royalblue', 25, 'a'], // not enough data on these yet
  ['wolfgrey', 25, '4'],
  ['oldlace', 20, '2'],
  ['mainecoon', 0, '5'],
  ['gerbil', 40, '3'],
  ['violet', 25, '9'],
  ['cottoncandy', 20, '4'],
  ['cerulian', 25, '5'],
  ['fabulous', 15, '2'],
  ['chartreux', 0, 'a'],
  ['jaguar', 5, 'b'],
  ['whixtensions', 40, '0'],
  ['dali', 40, '4'],
  ['bubblegum', 10, '3'],
  ['googly', 15, '3'],
  ['peach', 30, '2'],
  ['otaku', 15, '4'],
  ['skyblue', 25, '6'],
  ['limegreen', 10, '1'],
  ['bloodred', 30, '3'],
  ['scarlet', 25, 'a'],
  ['beard', 40, '8'],
  ['cloudwhite', 20, '0'],
  ['calicool', 5, '8'],
  ['laperm', 0, '6'],
  ['barkbrown', 25, 'b'],
  ['emeraldgreen', 30, '7'],
  ['gold', 10, '1'],
  ['tongue', 40, '7'],
  ['chestnut', 10, '6'],
  ['spock', 5, 'c'],
  ['mauveover', 20, '5'],
  ['cymric', 0, '9'],
  ['shadowgrey', 20, '0'],
  ['coffee', 25, 'c'],
  ['salmon', 20, '1']
]

export function getCattributes (geneStr) {
  let cattributes = []
  let cg
  for (var i in cattributeGenes) {
    cg = cattributeGenes[i]
    if (geneStr[59 - cg[1]] === cg[2]) {
      cattributes.push(cg[0])
    }
  }
  return cattributes
}
