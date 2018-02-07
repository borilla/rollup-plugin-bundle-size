const chalk = require('chalk');
const fileSize = require('filesize');
const gzip = require('gzip-size');

function defaultReport(file, { bundleSizeBytes, gzipSizeBytes }, pluginOptions) {
	if (!pluginOptions.silent) {
		const bundleSizeStr = chalk.bold(fileSize(bundleSizeBytes));
		const gzipSizeStr = chalk.bold(fileSize(gzipSizeBytes));

		console.log(chalk.green(`${file}: ${bundleSizeStr} (${gzipSizeStr} gzip)`));
	}
}

module.exports = function (pluginOptions) {
	pluginOptions = pluginOptions || {};
	const report = pluginOptions.report || defaultReport;

	return {
		ongenerate(bundleOptions, bundle) {
			const metrics = {
				get bundleSizeBytes() {
					delete this.bundleSizeBytes;
					return this.bundleSizeBytes = Buffer.byteLength(bundle.code);
				},
				get gzipSizeBytes() {
					delete this.gzipSizeBytes;
					return this.gzipSizeBytes = gzip.sync(bundle.code);
				},
			};

			report(bundleOptions.file, metrics, pluginOptions);
		}
	};
};
