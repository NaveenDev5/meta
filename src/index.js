/* ──────────────────────╮
 │ @thebespokepixel/meta │
 ╰───────────────────────┴───────────────────────────────────────────────────── */
/**
 * @module @thebespokepixel/meta
 * @private
 */

import {readPackageUpSync} from 'read-pkg-up'

/**
 * Creates the metadata collection function, starting at the path provided or
 * the current working directory by default.
 * @function meta
 * @param  {string} cwd The directory to start searching for a package.json file.
 * @return {metadata}   The map of reduced package metadata.
 */
export default function meta(cwd = '.') {
	const pkg = readPackageUpSync({cwd}).packageJson

	/**
	 * Extract metadata for sharing inside a package.
	 * @const {metadata}
	 * @property {string} name          The package's name
	 * @property {string} bin           The CLI binary we provide
	 * @property {string} description   The description from package.json
	 * @property {string} copyright     Copyright info from package.json
	 * @property {string} license       The package license
	 * @property {string} bugs          Our issues queue
	 * @property {string} bin           Declared package binaries
	 */
	const metadata = {
		get name() {
			return pkg.name
		},
		get description() {
			return pkg.description ? pkg.description : 'No description'
		},
		get copyright() {
			if (pkg.copyright && pkg.copyright.year) {
				return `©${pkg.copyright.year} ${pkg.copyright.owner}`
			}

			return pkg.copyright ? pkg.copyright :
				`©${new Date().getFullYear()} ${pkg.author.name}`
		},
		get license() {
			return pkg.license
		},
		get bugs() {
			return pkg.bugs.url
		},
		get bin() {
			return pkg.bin ? Object.keys(pkg.bin)[0] : 'none'
		},
		/**
		 * Print a package version string.
		 * @param  {number} style The version string format wanted:
		 * ```
		 * 1: Simple number format: 0.1.2
		 * 2: Long version with name: @thebespokepixel/meta v0.1.2
		 * 3: v-prefixed version number: v0.1.2
		 * ```
		 * @return {string} The version string.
		 */
		version: (style = 1) => {
			const version = (function () {
				if (pkg.buildNumber > 0) {
					return `${pkg.version}-Δ${pkg.buildNumber}`
				}

				return `${pkg.version}`
			})()

			switch (style) {
				case 4:
					return `${pkg.version}`
				case 3:
					return `v${version}`
				case 2:
					return `${pkg.name} v${version}`
				default:
					return version
			}
		}
	}

	return metadata
}
