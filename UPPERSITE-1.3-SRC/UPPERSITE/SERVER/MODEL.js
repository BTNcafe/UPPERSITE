FOR_BOX(function(box) {'use strict';

	OVERRIDE(box.MODEL, function(origin) {

		/**
		 * Model(include CRUD functions) class
		 */
		box.MODEL = CLASS({

			init : function(inner, self, params) {
				//REQUIRED: params
				//REQUIRED: params.name
				//OPTIONAL: params.config

				var
				// name
				name = params.name,

				// config
				config = params.config,

				// create config
				createConfig,

				// get config
				getConfig,

				// update config
				updateConfig,

				// remove config
				removeConfig,

				// find config
				findConfig,

				// count conifg
				countConfig,

				// check is exists conifg
				checkIsExistsConfig,

				// create valid
				createValid,

				// update valid
				updateValid,

				// _init data.
				_initData,

				// init data.
				initData,

				// db
				db = box.DB(name),

				// room
				room = box.ROOM(name),

				// room for update
				roomForUpdate = box.ROOM(name + '/{id}'),

				// get create valid.
				getCreateValid,

				// get update valid.
				getUpdateValid,

				// get db.
				getDB,

				// get room.
				getRoom,

				// create.
				create,

				// get.
				get,

				// update.
				update,

				// remove.
				remove,

				// find.
				find,

				// count.
				count,

				// check is exists.
				checkIsExists,

				// get name.
				getName;

				// init config.
				if (config !== undefined) {

					createConfig = config.create;
					getConfig = config.get;
					updateConfig = config.update;
					removeConfig = config.remove;
					findConfig = config.find;
					countConfig = config.count;
					checkIsExistsConfig = config.checkIsExists;

					if (createConfig !== undefined) {
						createValid = createConfig.valid;
						_initData = createConfig.initData;
					}

					if (updateConfig !== undefined) {
						updateValid = updateConfig.valid;
					}
				}

				inner.getCreateValid = getCreateValid = function() {
					return createValid;
				};

				inner.getUpdateValid = getUpdateValid = function() {
					return updateValid;
				};

				inner.initData = initData = function(data) {

					if (_initData !== undefined) {
						_initData(data);
					}

					return data;
				};

				// create.
				if (createConfig !== false) {

					room.on('create', function(params, data, headers, ret) {

						var
						// valid result
						validResult,

						// proc.
						proc;

						initData(data);

						if (createValid !== undefined) {
							validResult = createValid.check({
								data : data
							});
						}

						if (validResult !== undefined && validResult.checkHasError() === true) {

							ret({
								hasError : true,
								errors : validResult.getErrors()
							});

						} else {

							proc = function() {

								db.create(data, function(errorMsg, savedData) {

									if (errorMsg !== undefined) {

										ret({
											hasError : true,
											errorMsg : errorMsg
										});

									} else {

										if (inner.afterCreate !== undefined) {
											inner.afterCreate(savedData);
										}

										if (inner.afterCreateRoom !== undefined) {
											inner.afterCreateRoom({
												room : room,
												savedData : savedData,
												headers : headers
											});
										}

										box.ROOMS(name + '/create').broadcast({
											methodName : 'create',
											data : savedData
										});

										EACH(savedData, function(value, propertyName) {
											box.ROOMS(name + '/' + propertyName + '/' + value + '/create').broadcast({
												methodName : 'create',
												data : savedData
											});
										});

										ret({
											hasError : false,
											savedData : savedData
										});
									}
								});
							};

							if (inner.beforeCreateRoom === undefined) {

								if (inner.beforeCreate !== undefined) {
									if (inner.beforeCreate(data, {
										ret : ret,
										proc : proc
									}) !== false) {
										proc();
									}
								} else {
									proc();
								}
							} else {
								inner.beforeCreateRoom({
									room : room,
									data : data,
									headers : headers
								}, {
									ret : ret,
									proc : proc
								});
							}

						}

					});

				}

				// update.
				if (updateConfig !== false) {

					roomForUpdate.on('update', function(params, data, headers, ret) {

						var
						// id
						id = params.id,

						// valid result
						validResult = updateValid === undefined ? undefined : updateValid.check({
							data : data,
							isExceptUndefined : true
						}),

						// proc.
						proc;

						data.id = id;

						if (updateValid !== undefined && validResult.checkHasError() === true) {

							ret({
								hasError : true,
								errors : validResult.getErrors()
							});

						} else {

							proc = function() {

								db.update(data, function(errorMsg, savedData) {

									if (errorMsg !== undefined) {

										ret({
											hasError : true,
											errorMsg : errorMsg
										});

									} else {

										if (savedData !== undefined) {

											if (inner.afterUpdate !== undefined) {
												inner.afterUpdate(savedData);
											}

											if (inner.afterUpdateRoom !== undefined) {
												inner.afterUpdateRoom({
													room : roomForUpdate,
													savedData : savedData,
													headers : headers
												});
											}

											box.ROOMS(name + '/' + id).broadcast({
												methodName : 'update',
												data : savedData
											});

											EACH(savedData, function(value, propertyName) {
												box.ROOMS(name + '/' + propertyName + '/' + value + '/update').broadcast({
													methodName : 'update',
													data : savedData
												});
											});
										}

										ret({
											hasError : false,
											savedData : savedData
										});
									}
								});
							};

							if (inner.beforeUpdateRoom === undefined) {

								if (inner.beforeUpdate !== undefined) {
									if (inner.beforeUpdate(data, {
										ret : ret,
										proc : proc
									}) !== false) {
										proc();
									}
								} else {
									proc();
								}
							} else {
								if (inner.beforeUpdateRoom({
									room : roomForUpdate,
									data : data,
									headers : headers
								}, {
									ret : ret,
									proc : proc
								}) !== false) {
									proc();
								}
							}

						}

					});
				}

				// remove.
				if (removeConfig !== false) {

					roomForUpdate.on('remove', function(params, id, headers, ret) {

						var
						// proc.
						proc;

						proc = function() {

							db.remove(id, function(errorMsg, savedData) {

								if (errorMsg !== undefined) {

									ret({
										hasError : true,
										errorMsg : errorMsg
									});

								} else {

									if (savedData !== undefined) {

										if (inner.afterRemove !== undefined) {
											inner.afterRemove(savedData);
										}

										if (inner.afterRemoveRoom !== undefined) {
											inner.afterRemoveRoom({
												room : roomForUpdate,
												savedData : savedData,
												headers : headers
											});
										}

										box.ROOMS(name + '/' + id).broadcast({
											methodName : 'remove',
											data : savedData
										});

										EACH(savedData, function(value, propertyName) {
											box.ROOMS(name + '/' + propertyName + '/' + value + '/remove').broadcast({
												methodName : 'remove',
												data : savedData
											});
										});
									}

									ret({
										hasError : false,
										savedData : savedData
									});
								}
							});
						};

						if (inner.beforeRemoveRoom === undefined) {

							if (inner.beforeRemove !== undefined) {
								if (inner.beforeRemove(id, {
									ret : ret,
									proc : proc
								}) !== false) {
									proc();
								}
							} else {
								proc();
							}
						} else {
							if (inner.beforeRemoveRoom({
								room : roomForRemove,
								id : id,
								headers : headers
							}, {
								ret : ret,
								proc : proc
							}) !== false) {
								proc();
							}
						}

					});
				}

				inner.getDB = getDB = function() {
					return db;
				};

				inner.getRoom = getRoom = function() {
					return room;
				};

				// create.
				if (createConfig !== false) {

					self.create = create = function(data, ret) {
						//REQUIRED: data
						//OPTIONAL: ret

						var
						// valid result
						validResult,

						// proc.
						proc;

						initData(data);

						if (createValid !== undefined) {
							validResult = createValid.check({
								data : data
							});
						}

						if (validResult !== undefined && validResult.checkHasError() === true) {

							if (ret !== undefined) {
								ret({
									hasError : true,
									errors : validResult.getErrors()
								});
							}

						} else {

							// proc
							proc = function() {

								db.create(data, function(errorMsg, savedData) {

									if (errorMsg !== undefined) {

										if (ret !== undefined) {
											ret({
												hasError : true,
												errorMsg : errorMsg
											});
										}

									} else {

										if (inner.afterCreate !== undefined) {
											inner.afterCreate(savedData);
										}

										box.ROOMS(name + '/create').broadcast({
											methodName : 'create',
											data : savedData
										});

										EACH(savedData, function(value, propertyName) {
											box.ROOMS(name + '/' + propertyName + '/' + value + '/create').broadcast({
												methodName : 'create',
												data : savedData
											});
										});

										if (ret !== undefined) {
											ret({
												hasError : false,
												savedData : savedData
											});
										}
									}
								});
							};

							if (inner.beforeCreate !== undefined) {
								if (inner.beforeCreate(data, {
									ret : ret,
									proc : proc
								}) !== false) {
									proc();
								}
							} else {
								proc();
							}
						}
					};
				}

				// get.
				if (getConfig !== false) {

					self.get = get = function(idOrParams, ret) {
						//REQUIRED: idOrParams
						//OPTIONAL: idOrParams.filter
						//OPTIONAL: idOrParams.sort
						//OPTIONAL: idOrParams.isRandom
						//OPTIONAL: ret

						db.get(idOrParams, function(errorMsg, savedData) {

							if (errorMsg !== undefined) {

								if (ret !== undefined) {
									ret({
										hasError : true,
										errorMsg : errorMsg
									});
								}

							} else {

								if (inner.get === undefined || inner.get(savedData, ret) !== false) {

									if (ret !== undefined) {
										ret({
											hasError : false,
											savedData : savedData
										});
									}
								}
							}
						});
					};
				}

				// update.
				if (updateConfig !== false) {

					self.update = update = function(data, ret) {
						//REQUIRED: data
						//REQUIRED: data.id
						//OPTIONAL: ret

						var
						// valid result
						validResult = updateValid === undefined ? undefined : updateValid.check({
							data : data,
							isExceptUndefined : true
						}),

						// proc.
						proc;

						if (validResult !== undefined && validResult.checkHasError() === true) {

							if (ret !== undefined) {
								ret({
									hasError : true,
									errors : validResult.getErrors()
								});
							}

						} else {

							proc = function() {

								db.update(data, function(errorMsg, savedData) {

									if (errorMsg !== undefined) {

										if (ret !== undefined) {
											ret({
												hasError : true,
												errorMsg : errorMsg
											});
										}

									} else {

										if (savedData !== undefined) {

											if (inner.afterUpdate !== undefined) {
												inner.afterUpdate(savedData);
											}

											box.ROOMS(name + '/' + data.id).broadcast({
												methodName : 'update',
												data : savedData
											});

											EACH(savedData, function(value, propertyName) {
												box.ROOMS(name + '/' + propertyName + '/' + value + '/update').broadcast({
													methodName : 'update',
													data : savedData
												});
											});
										}

										if (ret !== undefined) {
											ret({
												hasError : false,
												savedData : savedData
											});
										}
									}
								});
							};

							if (inner.beforeUpdate !== undefined) {
								if (inner.beforeUpdate(data, {
									ret : ret,
									proc : proc
								}) !== false) {
									proc();
								}
							} else {
								proc();
							}
						}
					};
				}

				// remove.
				if (removeConfig !== false) {

					self.remove = remove = function(id, ret) {
						//REQUIRED: id
						//OPTIONAL: ret

						var
						// proc.
						proc;

						proc = function() {

							db.remove(id, function(errorMsg, savedData) {

								if (errorMsg !== undefined) {

									if (ret !== undefined) {
										ret({
											hasError : true,
											errorMsg : errorMsg
										});
									}

								} else {

									if (savedData !== undefined) {

										if (inner.afterRemove !== undefined) {
											inner.afterRemove(savedData);
										}

										box.ROOMS(name + '/' + savedData.id).broadcast({
											methodName : 'remove',
											data : savedData
										});

										EACH(savedData, function(value, propertyName) {
											box.ROOMS(name + '/' + propertyName + '/' + value + '/remove').broadcast({
												methodName : 'remove',
												data : savedData
											});
										});
									}

									if (ret !== undefined) {
										ret({
											hasError : false,
											savedData : savedData
										});
									}
								}
							});
						};

						if (inner.beforeRemove !== undefined) {
							if (inner.beforeRemove(id, {
								ret : ret,
								proc : proc
							}) !== false) {
								proc();
							}
						} else {
							proc();
						}
					};
				}

				// find.
				if (findConfig !== false) {

					self.find = find = function(params, ret) {
						//OPTIONAL: params
						//OPTIONAL: params.filter
						//OPTIONAL: params.sort
						//OPTIONAL: params.start
						//OPTIONAL: params.count
						//OPTIONAL: params.isFindAll
						//OPTIONAL: ret

						if (params !== undefined && ret === undefined) {
							ret = params;
							params = undefined;
						}

						db.find(params, function(errorMsg, savedDataSet) {

							if (errorMsg !== undefined) {

								if (ret !== undefined) {
									ret({
										hasError : true,
										errorMsg : errorMsg
									});
								}

							} else {

								if (inner.find === undefined || inner.find(savedDataSet, ret) !== false) {

									if (ret !== undefined) {
										ret({
											hasError : false,
											savedDataSet : savedDataSet
										});
									}
								}
							}

						});
					};
				}

				// count.
				if (countConfig !== false) {

					self.count = count = function(filter, ret) {
						//OPTIONAL: filter
						//OPTIONAL: ret

						if (filter !== undefined && ret === undefined) {
							ret = filter;
							filter = undefined;
						}

						db.count(filter, function(errorMsg, count) {

							if (errorMsg !== undefined) {

								if (ret !== undefined) {
									ret({
										hasError : true,
										errorMsg : errorMsg
									});
								}

							} else {

								if (inner.count === undefined || inner.count(count, ret) !== false) {

									if (ret !== undefined) {
										ret({
											hasError : false,
											count : count
										});
									}
								}
							}
						});
					};
				}

				// check is exists.
				if (checkIsExistsConfig !== false) {

					self.checkIsExists = checkIsExists = function(filter, ret) {
						//OPTIONAL: filter
						//OPTIONAL: ret

						if (filter !== undefined && ret === undefined) {
							ret = filter;
							filter = undefined;
						}

						db.checkIsExists(filter, function(errorMsg, isExists) {

							if (errorMsg !== undefined) {

								if (ret !== undefined) {
									ret({
										hasError : true,
										errorMsg : errorMsg
									});
								}

							} else {

								if (inner.checkIsExists === undefined || inner.checkIsExists(isExists, ret) !== false) {

									if (ret !== undefined) {
										ret({
											hasError : false,
											isExists : isExists
										});
									}
								}
							}
						});
					};
				}

				// get.
				if (getConfig !== false) {
					room.on('get', function(params, id, headers, ret) {
						get(id, ret);
					});
				}

				// find.
				if (findConfig !== false) {
					room.on('find', function(params, params2, headers, ret) {

						// delete isFindAll.
						delete params.isFindAll;

						find(params2, ret);
					});
				}

				// count.
				if (countConfig !== false) {
					room.on('count', function(params, params2, headers, ret) {
						count(params2, ret);
					});
				}

				// check is exists.
				if (checkIsExistsConfig !== false) {
					room.on('checkIsExists', function(params, params2, headers, ret) {
						checkIsExists(params2, ret);
					});
				}

				inner.getName = getName = function() {
					return name;
				};
			}
		});
	});
});
