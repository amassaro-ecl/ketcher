/****************************************************************************
 * Copyright 2020 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/

import Molfile from './molfile'

// TODO: reconstruct molfile string instead parsing multiple times
//       merge to bottom
/**
 * @param {string} str
 * @param {import('ketcher-core').MolfileParseOptions} options
 * */
function parseCTFile(str, options) {
  const molfile = new Molfile()
  const lines = str.split(/\r\n|[\n\r]/g)
  try {
    return molfile.parseCTFile(lines, options.reactionRelayout)
  } catch (ex) {
    if (options.badHeaderRecover) {
      try {
        // check whether there's an extra empty line on top
        // this often happens when molfile text is pasted into the dialog window
        return molfile.parseCTFile(lines.slice(1), options.reactionRelayout)
      } catch (ex1) {
        //
      }
      try {
        // check for a missing first line
        // this sometimes happens when pasting
        return molfile.parseCTFile([''].concat(lines), options.reactionRelayout)
      } catch (ex2) {
        //
      }
    }
    throw ex
  }
}

const molfileManager = {
  stringify(struct, options) {
    if (!options) {
      options = {}
    }
    return new Molfile().saveMolecule(
      struct,
      options.ignoreErrors,
      options.noRgroups,
      options.preserveIndigoDesc
    )
  },
  parse(str, options) {
    return parseCTFile(str, options || {})
  },
  version(molFileStr) {
    let regex = /v(?:2000|3000)/im
    const match = regex.exec(molFileStr)
    if (match) {
      return match[0].toUpperCase()
    }
    return 'V2000'
  }
}

export * from './molfileFormat'
export { molfileManager }
export default molfileManager
