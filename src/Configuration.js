'use strict';

var properties = require('../assets/properties.json');

/**
 * Objeto que contém as informações padrão das propriedades.
 *
 * @type {object}
 */
var DEFAULT = {
    PORT: 3000,
    TIMEOUT: 30000,
    ROOT_FOLDER: __dirname,
    OVERRIDE_RESPONSES: {},
    BIND_OBJECTS: [],
    HEADERS: {},
    PRINT_RESPONSE: false,
    PRINT_REQUEST_URL: true,
    PRINT_REQUEST_ERROR: true,
    COLORS: false
};

/**
 * Responsável por validar se as configurações fornecidas no arquivo {@link properties.json} são validas.
 *
 * @constructor
 */
function ConfigurationValidator() {
}

/**
 * Verifica se o objeto de sobrescrita de respostas é válido.
 *
 * @param override
 * @returns {boolean}
 */
ConfigurationValidator.prototype.isValidOverrideResponse = function (override) {
    return !!(override && override.field && override.value);
};

/**
 * Verifica se o objeto a ser feito o bind dos paths dos arquivos estáticos é válido.
 *
 * @param bind
 * @returns {boolean}
 */
ConfigurationValidator.prototype.isValidBindObject = function (bind) {
    return !!(bind && ((bind.uri && bind.path) || bind.folder));
};

/**
 * Responsável por informar os dados já validados por {@link ConfigurationValidator}.
 *
 * @constructor
 */
function Configuration() {

    var self = this,
        _properties = properties[properties.default] || properties,
        _validator = new ConfigurationValidator();

    self.host = function () {
        return process.argv[2] || _properties.host;
    };

    self.port = function () {
        return _properties.port || DEFAULT.PORT;
    };

    self.headers = function () {
        return _properties.headers || DEFAULT.HEADERS;
    };

    self.timeout = function () {
        return _properties.timeout || DEFAULT.TIMEOUT;
    };

    self.rootFolder = function () {
        return _properties.root_folder || DEFAULT.ROOT_FOLDER;
    };

    self.overrideResponses = function () {
        var overrideResponses = _properties.override_responses || DEFAULT.OVERRIDE_RESPONSES;

        for (var property in overrideResponses) {
            var overrides = overrideResponses[property];

            overrides.forEach(function (override) {
                if (!_validator.isValidOverrideResponse(override)) {

                    throw new ReferenceError("Invalid value for a override response object: " + override);
                }
            });
        }

        return overrideResponses;
    };

    self.bindObjects = function () {
        return _properties.bind.map(function (bind) {
            if (_validator.isValidBindObject(bind)) {
                return bind;
            } else {
                throw new ReferenceError("Invalid value for a bind object: " + bind);
            }
        });
    };

    self.printResponse = function () {
        var log = _properties.log || {};
        return !!(log.print_response || DEFAULT.PRINT_RESPONSE);
    };

    self.printRequestUrl = function () {
        var log = _properties.log || {};
        return !!(log.print_request_url || DEFAULT.PRINT_REQUEST_URL);
    };

    self.printRequestError = function () {
        var log = _properties.log || {};
        return !!(log.print_request_error || DEFAULT.PRINT_REQUEST_ERROR);
    };

    self.colors = function () {
        var log = _properties.log || {};
        return !!(log.colors || DEFAULT.COLORS);
    };
}

module.exports = new Configuration();