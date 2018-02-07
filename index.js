const chalk = require('chalk');
const fileSize = require('filesize');
const gzip = require('gzip-size');

function defaultReport(file, metrics, pluginOptions) {
	if (!pluginOptions.silent) {
		const { bundleSizeBytes, gzipSizeBytes } = metrics;
		const bundleSizeStr = chalk.bold(fileSize(bundleSizeBytes));
		const gzipSizeStr = chalk.bold(fileSize(gzipSizeBytes));
		const reportStr = chalk.green(`AAA ${file}: ${bundleSizeStr} (${gzipSizeStr} gzip)`);

		console.log(reportStr);
	}
}

module.exports = function (pluginOptions) {
	pluginOptions = pluginOptions || {};
	const report = pluginOptions.report || defaultReport;

	return {
		ongenerate(bundleOptions, bundle) {
			const bundleSizeBytes = Buffer.byteLength(bundle.code);
			const gzipSizeBytes = gzip.sync(bundle.code);
			const metrics = { bundleSizeBytes, gzipSizeBytes };

			report(bundleOptions.file, metrics, pluginOptions);
		}
	};
}
