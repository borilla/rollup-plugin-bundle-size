const chalk = require('chalk');
const fileSize = require('filesize');
const gzip = require('gzip-size');

function defaultRender(file, bundleSize, gzipSize, chalk) {
	return chalk.green(`${file}: ${chalk.bold(bundleSize)} (${chalk.bold(gzipSize)} gzipped)`);
}

function bundleSizePlugin(pluginOptions) {
	pluginOptions = pluginOptions || {};
	const silent = pluginOptions.silent || false;
	const render = pluginOptions.render || defaultRender;

	return {
		ongenerate(bundleOptions, bundle) {
			if (!silent) {
				const bundleSize = fileSize(Buffer.byteLength(bundle.code));
				const gzipSize = fileSize(gzip.sync(bundle.code));

				console.log(render(bundleOptions.file, bundleSize, gzipSize, chalk));
			}
		}
	};
}

module.exports = bundleSizePlugin;
