/*
 * Boot UPPERSITE.
 */
global.BOOT = BOOT = function(params) {'use strict';
	//OPTIONAL: params
	//OPTIONAL: params.CONFIG
	//OPTIONAL: params.NODE_CONFIG
	//OPTIONAL: params.BROWSER_CONFIG
	//OPTIONAL: params.MULTI_LANG_SUPPORT

	require('./UPPERCASE.JS-COMMON.js');
	require('./UPPERCASE.JS-NODE.js');

	CPU_CLUSTERING(function(workerData, on, broadcast) {

		var
		//IMPORT: clustor
		cluster = require('cluster'),

		// version
		version = Date.now(),

		// cpu count
		cpuCount = require('os').cpus().length,

		// i
		i,

		// work.
		work = function(sharedData) {

			var
			//IMPORT: fs
			fs = require('fs'),

			//IMPORT: path
			path = require('path'),

			// MULTI_LANG_SUPPORT
			MULTI_LANG_SUPPORT = params.MULTI_LANG_SUPPORT,

			// root path
			rootPath = __dirname + '/..',

			// browser script
			browserScript = '\nglobal = window;\n',

			// logo text
			logoText,

			// stringify JSON with function.
			stringifyJSONWithFunction,

			// load all.
			loadAll,

			// start server.
			startServer,

			// start Read-Eval-Print-Loop.
			startREPL;

			stringifyJSONWithFunction = function(data) {

				return JSON.stringify(data, function(key, value) {
					if ( typeof value === 'function') {
						return '__THIS_IS_FUNCTION_START__' + value.toString() + '__THIS_IS_FUNCTION_END__';
					}
					return value;
				}, '\t').replace(/("__THIS_IS_FUNCTION_START__(.*)__THIS_IS_FUNCTION_END__")/g, function(match, content) {
					return eval('(' + eval('"' + content.substring('"__THIS_IS_FUNCTION_START__'.length, content.length - '__THIS_IS_FUNCTION_END__"'.length) + '"') + ')').toString();
				});
			};

			loadAll = function(callback) {

				var
				// check is allowed folder.
				checkIsAllowedFolder,

				// init boxes.
				initBoxes,

				// load for server.
				loadForServer,

				// load for browser.
				loadForBrowser,

				// load.
				load,

				// scan folders.
				scanFolders,

				// load folders for server.
				loadFoldersForServer,

				// load folders for browser.
				loadFoldersForBrowser,

				// load folders.
				loadFolders,

				// override config.
				overrideConfig,

				// load database.
				loadDB,

				// minify.
				minify,

				// load logo text.
				loadLogoText;

				checkIsAllowedFolder = function(params) {
					//REQUIRED: params
					//REQUIRED: params.path
					//REQUIRED: params.name

					var
					// path
					path = params.path,

					// name
					name = params.name;

					return (

						// is directory
						fs.statSync(rootPath + '/' + path).isDirectory() === true &&

						// hide folder
						name[0] !== '.' &&

						// node.js module
						name !== 'node_modules' &&

						// not_load
						name !== 'not_load' &&

						// deprecated
						name !== 'deprecated' &&

						// _ folder
						name[0] !== '_'
					);
				};

				initBoxes = function() {

					fs.readdirSync(rootPath).forEach(function(boxName) {

						var
						// i
						i;

						if (checkIsAllowedFolder({
							path : boxName,
							name : boxName
						}) === true) {

							//LOADED: BOX
							BOX(boxName);

							// add to browser script.
							browserScript += 'BOX(\'' + boxName + '\');\n';
						}
					});
				};

				loadForServer = function(relativePath) {
					//REQUIRED: relativePath

					var
					// absolute path
					absolutePath = rootPath + '/' + relativePath,

					// extname
					extname = path.extname(relativePath),

					// extension
					extension,

					// version
					version,

					// content
					content;

					// UPPERSITE only using JavaScript.
					if (absolutePath.substring(0, (rootPath + '/UPPERSITE').length) !== rootPath + '/UPPERSITE') {

						// when other language.
						for (extension in MULTI_LANG_SUPPORT) {
							if (MULTI_LANG_SUPPORT.hasOwnProperty(extension) === true) {
								if (extname === '.' + extension) {

									// generate version.
									version = '//' + fs.statSync(absolutePath).mtime.getTime();

									if (
									// check exists compiled file.
									fs.existsSync(absolutePath + '.__UPPERSITE_COMPILED') === false ||

									// check version.
									fs.readFileSync(absolutePath + '.__UPPERSITE_COMPILED').toString().substring(0, version.length) !== version) {

										// compile.
										content = version + '\n' + MULTI_LANG_SUPPORT[extension](fs.readFileSync(absolutePath).toString(), absolutePath);
										fs.writeFileSync(absolutePath + '.__UPPERSITE_COMPILED', content);
									}

									// import.
									require(absolutePath + '.__UPPERSITE_COMPILED');

									// return.
									return;
								}
							}
						}
					}

					if (extname === '.js' || extname === '.JS') {

						// import.
						require(absolutePath);

					} else if (extname === '.__UPPERSITE_COMPILED') {

						if (fs.existsSync(absolutePath.substring(0, absolutePath.length - '.__UPPERSITE_COMPILED'.length)) === false) {

							// delete trash compiled file.
							fs.unlinkSync(absolutePath);
						}
					}
				};

				loadForBrowser = function(relativePath) {
					//REQUIRED: relativePath

					var
					// absolute path
					absolutePath = rootPath + '/' + relativePath,

					// extname
					extname = path.extname(relativePath),

					// extension
					extension,

					// version
					version,

					// content
					content;

					// UPPERSITE only using JavaScript.
					if (absolutePath.substring(0, (rootPath + '/UPPERSITE').length) !== rootPath + '/UPPERSITE') {

						// when other language.
						for (extension in MULTI_LANG_SUPPORT) {
							if (MULTI_LANG_SUPPORT.hasOwnProperty(extension) === true) {
								if (extname === '.' + extension) {

									// generate version.
									version = '//' + fs.statSync(absolutePath).mtime.getTime();

									if (
									// check exists compiled file.
									fs.existsSync(absolutePath + '.__UPPERSITE_COMPILED') === false ||

									// check version.
									fs.readFileSync(absolutePath + '.__UPPERSITE_COMPILED').toString().substring(0, version.length) !== version) {

										// compile.
										content = version + '\n' + MULTI_LANG_SUPPORT[extension](fs.readFileSync(absolutePath).toString(), absolutePath);
										fs.writeFileSync(absolutePath + '.__UPPERSITE_COMPILED', content);

									} else {

										// get exists compiled file.
										content = fs.readFileSync(absolutePath + '.__UPPERSITE_COMPILED').toString();
									}

									// add to browser script. (other lang)
									browserScript += content + '\n';

									// return.
									return;
								}
							}
						}
					}

					if (extname === '.js' || extname === '.JS') {

						// get js file.
						content = fs.readFileSync(absolutePath).toString();

						// add to browser script.
						browserScript += content + '\n';

					} else if (extname === '.__UPPERSITE_COMPILED') {

						if (fs.existsSync(absolutePath.substring(0, absolutePath.length - '.__UPPERSITE_COMPILED'.length)) === false) {

							// delete trash compiled file.
							fs.unlinkSync(absolutePath);
						}
					}
				};

				load = function(relativePath) {
					//REQUIRED: relativePath

					loadForServer(relativePath);
					loadForBrowser(relativePath);
				};

				scanFolders = function(folderName, func) {
					//REQUIRED: folderName
					//REQUIRED: func

					var
					// scan folder.
					scanFolder = function(path) {
						//REQUIRED: path

						var
						// folder paths
						folderPaths,

						// extra
						i;

						if (fs.existsSync(path) === true) {

							folderPaths = [];

							fs.readdirSync(path).forEach(function(name) {

								var fullPath = path + '/' + name;

								if (checkIsAllowedFolder({
									path : fullPath,
									name : name
								}) === true) {
									folderPaths.push(fullPath);
								} else if (fs.statSync(rootPath + '/' + fullPath).isDirectory() !== true) {
									func(fullPath);
								}
							});

							for ( i = 0; i < folderPaths.length; i += 1) {
								scanFolder(folderPaths[i]);
							}
						}
					};

					//LOADED: FOR_BOX
					FOR_BOX(function(box) {
						scanFolder(box.boxName + '/' + folderName);
					});
				};

				loadFoldersForServer = function(folderName) {
					//REQUIRED: folderName

					scanFolders(folderName, loadForServer);
				};

				loadFoldersForBrowser = function(folderName) {
					//REQUIRED: folderName

					scanFolders(folderName, loadForBrowser);
				};

				loadFolders = function(folderName) {
					//REQUIRED: folderName

					scanFolders(folderName, load);
				};

				overrideConfig = function() {

					if (params !== undefined) {

						if (params.CONFIG !== undefined) {

							EXTEND_DATA({
								origin : global.CONFIG,
								extend : params.CONFIG
							});

							// add to browser script.
							browserScript += 'EXTEND_DATA({ origin : global.CONFIG, extend : ' + stringifyJSONWithFunction(params.CONFIG) + ' });\n';
						}

						if (params.NODE_CONFIG !== undefined) {

							EXTEND_DATA({
								origin : global.NODE_CONFIG,
								extend : params.NODE_CONFIG
							});

							NODE_CONFIG.rootPath = rootPath;
						}

						if (params.BROWSER_CONFIG !== undefined) {

							// add to browser script.
							browserScript += 'EXTEND_DATA({ origin : global.BROWSER_CONFIG, extend : ' + stringifyJSONWithFunction(params.BROWSER_CONFIG) + ' });\n';
						}
					}

					//!!! set version.
					CONFIG.version = sharedData.version;
					CONFIG.workerId = cluster.worker.id;

					// add to browser script.
					browserScript += 'CONFIG.version = ' + CONFIG.version + ';\n';
					browserScript += 'CONFIG.workerId = ' + CONFIG.workerId + ';\n';
				};

				loadDB = function(callback) {

					if (NODE_CONFIG.isNotUsingDB === true) {

						callback();

					} else {

						NODE_CONFIG.maxDataCount = NODE_CONFIG.maxDataCount;

						if (NODE_CONFIG.isNotRequiringDBAuth !== true) {

							CONNECT_TO_DB_SERVER({
								name : NODE_CONFIG.dbName,
								host : NODE_CONFIG.dbHost,
								port : NODE_CONFIG.dbPort,
								username : NODE_CONFIG.dbUsername,
								password : NODE_CONFIG.dbPassword
							}, callback);

						} else {

							CONNECT_TO_DB_SERVER({
								name : NODE_CONFIG.dbName
							}, callback);
						}
					}
				};

				minify = function() {

					var
					// uglify-js
					uglifyJS = UPPERSITE.MODULE('uglify-js');

					// minify browser script.
					browserScript = uglifyJS.minify(browserScript, {
						fromString : true,
						mangle : true
					}).code;
				};

				loadLogoText = function() {

					logoText = fs.readFileSync(rootPath + '/UPPERSITE/LOGO');

					browserScript = '/* Welcome to JavaScript World! :)\n' + logoText + '\n  Contact: ' + CONFIG.contactAddress + '\n\n*/' + browserScript;
				};

				// load base scripts.
				load('UPPERSITE/UPPERCASE.JS-COMMON.js');

				// load UPPERCASE.IO-OCTOPUS BOX Core.
				load('UPPERSITE/OCTOPUS/UPPERCASE.IO-BOX/CORE.js');

				initBoxes();

				loadForBrowser('UPPERSITE/UPPERCASE.JS-BROWSER.js');
				loadForServer('UPPERSITE/UPPERCASE.JS-NODE.js');

				// load UPPERCASE.IO-OCTOPUS.
				loadForBrowser('UPPERSITE/OCTOPUS/UPPERCASE.IO-BOX/BROWSER.js');
				loadForServer('UPPERSITE/OCTOPUS/UPPERCASE.IO-DB/NODE.js');
				loadForServer('UPPERSITE/OCTOPUS/UPPERCASE.IO-TRANSPORT/NODE.js');

				loadFolders('COMMON');
				loadFoldersForServer('SERVER');
				loadFoldersForBrowser('BROWSER');

				overrideConfig();

				loadForBrowser('UPPERSITE/BROWSER_INIT.js');

				if (CONFIG.isDevMode !== true) {
					minify();
				}

				loadLogoText();

				loadDB(callback);
			};

			startServer = function() {

				var
				//IMPORT: http
				http = require('http'),

				//IMPORT: https
				https = require('https'),

				//IMPORT: socket.io
				socketIO = UPPERSITE.MODULE('socket.io'),

				//IMPORT: formidable.IncomingForm
				IncomingForm = UPPERSITE.MODULE('formidable').IncomingForm,

				//IMPORT: imagemagick
				imagemagick = UPPERSITE.MODULE('imagemagick'),

				// server
				server,

				// secured server
				securedServer,

				// io
				io,

				// serve.
				serve;

				serve = function(req, res) {
					//REQUIRED: req
					//REQUIRED: res

					var
					// url
					url = req.url,

					// uri
					uri,

					// version
					version,

					// param str
					paramStr,

					// box name
					boxName,

					// response cache
					responseCache = {},

					// method
					method = req.method.toUpperCase(),

					// headers
					headers = req.headers,

					// ip
					ip,

					// get content type from uri.
					getContentTypeFromURI,

					// get encoding from content type.
					getEncodingFromContentType,

					// separate uri.
					separateURI,

					// separate box name.
					separateBoxName,

					// check is cached.
					checkIsCached,

					// redirect.
					redirect,

					// response cached.
					responseCached,

					// response.
					response,

					// serve browser script.
					serveBrowserScript,

					// serve upload.
					serveUpload,

					// serve web resource.
					serveWebResource,

					// serve upload resource.
					serveUploadResource,

					// serve error page.
					serveErrorPage;

					headers.ip = req.headers['X-Forwarded-For'];

					if (headers.ip === undefined) {
						headers.ip = req.connection.remoteAddress;
					}

					getContentTypeFromURI = function(uri) {
						//REQUIRED: uri

						var
						// extname
						extname = path.extname(uri);

						if (extname === '.png') {
							return 'image/png';
						}

						if (extname === '.jpg' || extname === '.jpeg') {
							return 'image/jpeg';
						}

						if (extname === '.gif') {
							return 'image/gif';
						}

						if (extname === '.js') {
							return 'text/javascript';
						}

						if (extname === '.json') {
							return 'application/json';
						}

						if (extname === '.css') {
							return 'text/css';
						}

						if (extname === '.txt') {
							return 'text/plain';
						}

						if (extname === '.html') {
							return 'text/html';
						}

						if (extname === '.swf') {
							return 'application/x-shockwave-flash';
						}

						return 'application/octet-stream';
					};

					getEncodingFromContentType = function(contentType) {
						//REQUIRED: contentType

						if (contentType === 'text/javascript') {
							return 'utf-8';
						}

						if (contentType === 'text/css') {
							return 'utf-8';
						}

						if (contentType === 'text/plain') {
							return 'binary';
						}

						if (contentType === 'text/html') {
							return 'utf-8';
						}

						if (contentType === 'image/png') {
							return 'binary';
						}

						if (contentType === 'image/jpeg') {
							return 'binary';
						}

						if (contentType === 'image/gif') {
							return 'binary';
						}

						if (contentType === 'application/x-shockwave-flash') {
							return 'binary';
						}

						return 'binary';
					};

					separateURI = function() {

						var
						// extras
						i = url.indexOf('?');

						if (i !== -1) {
							paramStr = decodeURI(url.substring(i + 1));
							url = url.substring(0, i);
						}

						uri = url.substring(1);
					};

					separateBoxName = function() {

						var
						// extras
						i = uri.indexOf('/');

						if (i === -1) {
							boxName = CONFIG.defaultBoxName;
						} else {
							boxName = uri.substring(0, i);

							if (global[boxName] !== undefined && global[boxName].type === BOX) {
								uri = uri.substring(i + 1);
							} else {
								boxName = CONFIG.defaultBoxName;
							}
						}
					};

					checkIsCached = function(isFinal) {
						//OPTIONAL: isFinal

						return isFinal === true ?

						// just cache.
						(req.headers['if-none-match'] !== undefined || req.headers['if-modified-since'] !== undefined) :

						// check version.
						(
							// check ETag.
							(req.headers['if-none-match'] !== undefined && parseInt(req.headers['if-none-match'], 10) === CONFIG.version) ||

							// check Last-Modified
							(req.headers['if-modified-since'] !== undefined && new Date(req.headers['if-modified-since']).getTime() === parseInt(CONFIG.version / 1000, 10) * 1000)
						);
					};

					redirect = function(url) {
						//REQUIRED: url

						res.writeHead(302, {
							'Location' : url
						});
						res.end();
					};

					responseCached = function() {
						res.statusCode = 304;
						res.end();
					};

					response = function(params) {
						//REQUIRED: params
						//REQUIRED: params.content
						//REQUIRED: params.contentType
						//REQUIRED: params.encoding
						//OPTIONAL: params.isToCache
						//OPTIONAL: params.lastModifiedTime

						var
						// content
						content = params.content,

						// content type
						contentType = params.contentType,

						// encoding
						encoding = params.encoding,

						// is to cache
						isToCache = params.isToCache,

						// last modified time
						lastModifiedTime = params.lastModifiedTime;

						res.setHeader('Content-Type', contentType);

						if (CONFIG.isDevMode !== true) {

							// last modified time cache.
							if (lastModifiedTime !== undefined) {
								res.setHeader('ETag', lastModifiedTime.getTime());
								res.setHeader('Last-Modified', lastModifiedTime.toUTCString());
							}

							// version cache.
							else if (isToCache === true) {
								res.setHeader('ETag', CONFIG.version);
								res.setHeader('Last-Modified', new Date(CONFIG.version).toUTCString());
							}
						}

						res.statusCode = 200;
						res.end(content, encoding);
					};

					serveBrowserScript = function() {
						response({
							content : browserScript,
							contentType : 'text/javascript',
							encoding : 'utf-8'
						});
					};

					serveUpload = function() {

						var
						// form
						form = new IncomingForm(),

						// file data set
						fileDataSet = [],

						// field data
						fieldData = {};

						form.uploadDir = '__UPLOAD/' + boxName + '/__TEMP/';

						if (fs.existsSync(rootPath + '/' + form.uploadDir) === false) {
							console.log('Not exists folder: ' + rootPath + '/' + form.uploadDir);
						}

						if (global[boxName] !== undefined && fs.existsSync(rootPath + '/' + form.uploadDir) === true) {

							form.on('field', function(fieldName, value) {

								fieldData[fieldName] = value;

							}).on('file', function(fieldName, file) {

								fileDataSet.push({
									tempPath : file.path,
									size : file.size,
									name : file.name,
									type : file.type,
									lastModifiedDate : file.lastModifiedDate
								});

							}).on('end', function() {

								var
								// upload file database
								uploadFileDB = global[boxName].DB('__UPLOAD_FILE'),

								// uploaded count
								uploadedCount = 0;

								EACH(fileDataSet, function(fileData, i) {

									var
									// temp path
									tempPath = fileData.tempPath;

									if (fileData.size > CONFIG.maxUploadFileMB * 1024 * 1024) {

										// file size error.
										res.writeHead(200, {
											'Content-Type' : 'text/html'
										});
										res.end('<script>errorCode=\'SIZE\'</script>', 'utf-8');

										return false;
									}

									EACH(fieldData, function(value, name) {
										if (value.trim() !== '') {
											fileData[name] = value;
										}
									});

									REMOVE({
										data : fileData,
										key : 'tempPath'
									});

									imagemagick.readMetadata(tempPath, function(error, metadata) {

										var
										// f.
										f = function() {

											uploadFileDB.create(fileData, function(errorMsg, savedData) {

												var
												//IMPORT: mv
												mv = UPPERSITE.MODULE('mv'),

												// target path
												tergetPath = rootPath + '/__UPLOAD/' + boxName + '/' + savedData.id;

												if (errorMsg === undefined) {

													mv(tempPath, tergetPath, function() {

														uploadedCount += 1;

														if (uploadedCount === fileDataSet.length) {

															EACH(fileDataSet, function(fileData, i) {
																fileDataSet[i] = PACK_DATA(fileData);
															});

															res.writeHead(200, {
																'Content-Type' : 'text/html'
															});
															res.end('<script>fileDataSet=' + JSON.stringify(fileDataSet) + '</script>', 'utf-8');
														}

														console.log('File \'' + tergetPath + '\' (' + savedData.name + ', ' + savedData.size + ' byte) uploaded.');
													});
												}
											});
										};

										if (metadata.exif !== undefined) {
											fileData.exif = metadata.exif;

											imagemagick.convert([tempPath, '-auto-orient', tempPath], function(error) {
												f();
											});
										} else {
											f();
										}
									});
								});

							}).on('error', function(error) {

								// unknown error.
								res.writeHead(200, {
									'Content-Type' : 'text/html'
								});
								res.end('<script>errorCode=\'ERROR\'</script>', 'utf-8');
							});

							form.parse(req);

						} else {

							// unknown error.
							res.writeHead(200, {
								'Content-Type' : 'text/html'
							});
							res.end('<script>errorCode=\'ERROR\'</script>', 'utf-8');
						}
					};

					serveWebResource = function() {

						var
						// full path
						fullPath = rootPath + '/' + boxName + '/WEB/' + uri,

						// content type
						contentType,

						// encoding
						encoding;

						if (uri.length >= 7 && uri.substring(0, 7) === 'CACHED/') {
							if (checkIsCached(true) === true) {
								responseCached();
								return;
							}
						}

						if (uri.length >= 9 && uri.substring(0, 9) === '__UPLOAD/') {

							uri = uri.substring(9);
							serveUploadResource();

						} else if (checkIsCached() === true) {

							responseCached();

						} else if (url !== '/' && paramStr !== CONFIG.version + '') {

							redirect(url + '?' + CONFIG.version);

						} else {

							if (responseCache[fullPath] !== undefined) {

								response(responseCache[fullPath]);

							} else {

								contentType = getContentTypeFromURI(uri);

								encoding = getEncodingFromContentType(contentType);

								fs.exists(fullPath, function(exists) {

									if (exists === true) {

										fs.readFile(fullPath, encoding, function(error, content) {

											if (error !== null) {

												// serve index.html.
												fs.exists(fullPath + '/index.html', function(exists) {

													if (exists === true) {

														fs.readFile(fullPath + '/index.html', 'utf-8', function(error, content) {

															if (error !== null) {
																serveErrorPage(error);
															} else {

																response({
																	content : content,
																	contentType : 'text/html',
																	encoding : 'utf-8'
																});
															}
														});

													} else {
														serveErrorPage();
													}
												});

											} else {

												response(responseCache[fullPath] = {
													content : content,
													contentType : contentType,
													encoding : encoding,
													isToCache : url !== '/'
												});
											}
										});
									}

									// if not exists
									else {
										serveErrorPage();
									}
								});
							}
						}
					};

					serveUploadResource = function() {

						var
						// full path
						fullPath;

						if (checkIsCached(true) === true) {

							responseCached();

						} else {

							fullPath = rootPath + '/__UPLOAD/' + boxName + '/' + uri;

							fs.exists(fullPath, function(exists) {

								if (exists === true) {

									fs.readFile(fullPath, 'binary', function(error, content) {

										if (error !== null) {

											serveErrorPage(error);

										} else {

											fs.stat(fullPath, function(error, stat) {

												if (error !== null) {

													serveErrorPage(error);

												} else {

													response({
														content : content,
														contentType : 'application/octet-stream',
														encoding : 'binary',
														lastModifiedTime : stat.mtime
													});
												}
											});
										}
									});
								}

								// if not exists
								else {
									serveErrorPage();
								}
							});
						}
					};

					serveErrorPage = function(error) {

						if (error !== undefined) {
							console.log('[UPPERSITE] ERROR:', error);
						}

						fs.exists(CONFIG.defaultBoxName + '/ERROR.html', function(exists) {

							// if exists error page
							if (exists === true) {

								fs.readFile(CONFIG.defaultBoxName + '/ERROR.html', 'utf-8', function(error, content) {

									if (error === null) {

										res.writeHead(500, {
											'Content-Type' : 'text/html'
										});
										res.end(content, 'utf-8');
									}
								});
							}

							// if not exists error page, use UPPERSITE's error page.
							else {

								fs.readFile('UPPERSITE/ERROR.html', 'utf-8', function(error, content) {

									if (error === null) {

										res.writeHead(500, {
											'Content-Type' : 'text/html'
										});
										res.end(content, 'utf-8');
									}
								});
							}
						});
					};

					separateURI();

					if (method === 'POST') {

						separateBoxName();

						if (uri === '__UPLOAD') {
							serveUpload();
						} else {

							paramStr = '';

							req.on('data', function(data) {
								paramStr += data;
							});

							req.on('end', function() {

								if (global[boxName] !== undefined && global[boxName].REQUEST !== undefined && global[boxName].REQUEST.checkURI !== undefined && global[boxName].REQUEST.checkURI({
									uri : uri,
									method : method,
									paramStr : paramStr,
									headers : headers
								}, {
									response : response,
									serveErrorPage : serveErrorPage
								}) === true) {
									// good.
								} else {
									serveWebResource(boxName);
								}
							});
						}

					} else if (method === 'GET') {

						if (uri === '__SCRIPT') {
							serveBrowserScript();
						} else {

							separateBoxName();

							if (uri === '') {
								uri = 'index.html';
							}

							if (global[boxName] !== undefined && global[boxName].REQUEST !== undefined && global[boxName].REQUEST.checkURI !== undefined && global[boxName].REQUEST.checkURI({
								uri : uri,
								method : method,
								paramStr : paramStr,
								headers : headers
							}, {
								response : response,
								serveErrorPage : serveErrorPage
							}) === true) {
								// good.
							} else {
								serveWebResource(boxName);
							}
						}
					} else if (method === 'PUT' || method === 'DELETE') {

						separateBoxName();

						if (global[boxName] !== undefined && global[boxName].REQUEST !== undefined && global[boxName].REQUEST.checkURI !== undefined && global[boxName].REQUEST.checkURI({
							uri : uri,
							method : method,
							paramStr : paramStr,
							headers : headers
						}, {
							response : response,
							serveErrorPage : serveErrorPage
						}) === true) {
							// good.
						} else {
							serveWebResource(boxName);
						}
					}
				};

				server = http.createServer(serve).listen(CONFIG.port);

				// init secured sever.
				if (NODE_CONFIG.securedPort !== undefined) {

					securedServer = https.createServer({
						key : fs.readFileSync(rootPath + '/' + NODE_CONFIG.securedKeyFileName),
						cert : fs.readFileSync(rootPath + '/' + NODE_CONFIG.securedCrtFileName)
					}, serve).listen(NODE_CONFIG.securedPort);
				}

				io = socketIO.listen(CONFIG.socketIOPorts === undefined || CONFIG.socketIOPorts[CONFIG.workerId] === undefined ? CONFIG.port + CONFIG.workerId : CONFIG.socketIOPorts[CONFIG.workerId]);
				console.log('Socket.IO port:', CONFIG.socketIOPorts === undefined || CONFIG.socketIOPorts[CONFIG.workerId] === undefined ? CONFIG.port + CONFIG.workerId : CONFIG.socketIOPorts[CONFIG.workerId]);

				if (CONFIG.isDevMode === true) {
					io.set('log level', 2);
				} else {
					io.set('log level', 1);
				}

				io.configure(function() {
					//io.set('store', new socketIO.RedisStore);
					io.set('flash policy port', CONFIG.flashPolicyServerPort === undefined ? CONFIG.port + 1955 : CONFIG.flashPolicyServerPort);
					io.set('transports', CONFIG.transports);
				});

				CONNS.socketPack = io.sockets;
				CONNS.broadcastToAllWorkers = broadcast;

				INIT_OBJECTS();

				on('emitToAllSockets', function(params) {
					CONNS.emitToAllSockets(params);
				});

				FOR_BOX(function(box) {
					if (box.MAIN !== undefined) {
						box.MAIN(workerData, {
							on : on,
							broadcast : broadcast
						});
					}
				});

				console.log('[UPPERSITE] ' + CONFIG.defaultTitle + ' WORKER #' + workerData.id + ' (PID:' + workerData.pid + ') BOOTed. => http://localhost:' + CONFIG.port + (NODE_CONFIG.securedPort !== undefined ? ' SECUREd => https://localhost:' + NODE_CONFIG.securedPort : ''));
				//console.log('[UPPERSITE] ' + CONFIG.defaultTitle + ' WORKER BOOTed. => http://localhost:' + CONFIG.port + (NODE_CONFIG.securedPort !== undefined ? ' SECUREd => https://localhost:' + NODE_CONFIG.securedPort : ''));
			};

			startREPL = function() {

				DELAY(1, function() {

					var
					// relp
					repl = require('repl');

					repl.start({
						prompt : 'UPPERSITE> ',
						input : process.stdin,
						output : process.stdout
					});
				});
			};

			loadAll(function() {

				startServer();

				// when first worker, start REPL.
				//if (cluster.worker.id === 1) {
				if (NODE_CONFIG.isUsingREPL === true) {
					startREPL();
				}
				//}
			});
		},

		// fork.
		fork = function() {

			cluster.fork().send({
				version : version
			});
		};

		//TODO: websocket과 socket 통신을 하는 부분, http 통신을 하는 부분은 멀티코어로 작성하고,
		//TODO: socket.io는 따로 떼서 websocket을 지원하지 않는 브라우저일 경우만 처리하는 하나의 프로세스로 만든다.
		work({
			version : version
		});

		if (false) {

			if (cluster.isMaster) {

				// fork workers.
				for ( i = 0; i < cpuCount; i += 1) {
					fork();
				}

				cluster.on('exit', function(worker, code, signal) {
					console.log('[UPPERSITE] WORKER #' + worker.id + ' (PID:' + worker.process.pid + ') died. (' + (signal !== undefined ? signal : code) + '). restarting...');
					fork();
				});

			} else {
				process.on('message', work);
			}
		}
	});
};
