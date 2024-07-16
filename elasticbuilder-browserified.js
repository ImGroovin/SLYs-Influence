(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BrowserESB = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const esb = require("elastic-builder");
module.exports = {esb};
},{"elastic-builder":96}],2:[function(require,module,exports){
'use strict';

const {
    Query,
    util: { checkType, setDefault }
} = require('../../core');

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-adjacency-matrix-aggregation.html';

/**
 * A bucket aggregation returning a form of adjacency matrix.
 * The request provides a collection of named filter expressions,
 * similar to the `filters` aggregation request. Each bucket in the response
 * represents a non-empty cell in the matrix of intersecting filters.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-adjacency-matrix-aggregation.html)
 *
 * @example
 * const agg = esb.adjacencyMatrixAggregation('interactions').filters({
 *     grpA: esb.termsQuery('accounts', ['hillary', 'sidney']),
 *     grpB: esb.termsQuery('accounts', ['donald', 'mitt']),
 *     grpC: esb.termsQuery('accounts', ['vladimir', 'nigel'])
 * });
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 *
 * @extends BucketAggregationBase
 */
class AdjacencyMatrixAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name) {
        super(name, 'adjacency_matrix');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on AdjacencyMatrixAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in AdjacencyMatrixAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on AdjacencyMatrixAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error(
            'script is not supported in AdjacencyMatrixAggregation'
        );
    }

    /**
     * Sets a named filter query.
     *
     * @param {string} filterName Name for the filter.
     * @param {Query} filterQuery Query to filter on. Example - term query.
     * @returns {AdjacencyMatrixAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `filterQuery` is not an instance of `Query`
     */
    filter(filterName, filterQuery) {
        checkType(filterQuery, Query);

        setDefault(this._aggsDef, 'filters', {});

        this._aggsDef.filters[filterName] = filterQuery;
        return this;
    }

    /**
     * Assigns filters to already added filters.
     * Does not mix with anonymous filters.
     * If anonymous filters are present, they will be overwritten.
     *
     * @param {Object} filterQueries Object with multiple key value pairs
     * where filter name is the key and filter query is the value.
     * @returns {AdjacencyMatrixAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `filterQueries` is not an instance of object
     */
    filters(filterQueries) {
        checkType(filterQueries, Object);

        setDefault(this._aggsDef, 'filters', {});

        Object.assign(this._aggsDef.filters, filterQueries);
        return this;
    }

    /**
     * Sets the `separator` parameter to use a separator string other than
     * the default of the ampersand.
     *
     * @param {string} sep the string used to separate keys in intersections buckets
     * e.g. & character for keyed filters A and B would return an
     * intersection bucket named A&B
     * @returns {AdjacencyMatrixAggregation} returns `this` so that calls can be chained
     */
    separator(sep) {
        this._aggsDef.separator = sep;
        return this;
    }
}

module.exports = AdjacencyMatrixAggregation;

},{"../../core":82,"./bucket-aggregation-base":4}],3:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const BucketAggregationBase = require('./bucket-aggregation-base');

/**
 * A multi-bucket aggregation similar to the Date histogram aggregation except instead of
 * providing an interval to use as the width of each bucket, a target number of buckets
 * is provided indicating the number of buckets needed and the interval of the buckets
 * is automatically chosen to best achieve that target. The number of buckets returned
 * will always be less than or equal to this target number.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-autodatehistogram-aggregation.html)
 *
 * @example
 * const agg = esb.autoDateHistogramAggregation('sales_over_time', 'date', 15);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string} field The field to aggregate on
 * @param {number} buckets Bucket count to generate histogram over.
 *
 * @extends BucketAggregationBase
 */
class AutoDateHistogramAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field, buckets) {
        super(name, 'auto_date_histogram', field);
        if (!isNil(buckets)) this._aggsDef.buckets = buckets;
    }

    /**
     * Sets the histogram bucket count. Buckets are generated based on this value.
     *
     * @param {number} buckets Bucket count to generate histogram over.
     * @returns {AutoDateHistogramAggregation} returns `this` so that calls can be chained
     */
    buckets(buckets) {
        this._aggsDef.buckets = buckets;
        return this;
    }

    /**
     * The minimum_interval allows the caller to specify the minimum rounding interval that
     * should be used. This can make the collection process more efficient, as the
     * aggregation will not attempt to round at any interval lower than minimum_interval.
     *
     * Accepted units: year, month, day, hour, minute, second
     *
     * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-autodatehistogram-aggregation.html#_minimum_interval_parameter)
     *
     * @example
     * const agg = esb.autoDateHistogramAggregation(
     *     'sales_over_time',
     *     'date',
     *     5
     * ).minimumInterval('minute');
     *
     * @param {string} interval Minimum Rounding Interval Example: 'minute'
     * @returns {AutoDateHistogramAggregation} returns `this` so that calls can be chained
     */
    minimumInterval(interval) {
        this._aggsDef.minimum_interval = interval;
        return this;
    }

    /**
     * Sets the format expression for `key_as_string` in response buckets.
     * If no format is specified, then it will use the first format specified in the field mapping.
     *
     * @example
     * const agg = esb.autoDateHistogramAggregation(
     *     'sales_over_time',
     *     'date',
     *     5
     * ).format('yyyy-MM-dd');
     *
     * @param {string} fmt Format mask to apply on aggregation response. Example: ####.00.
     * For Date Histograms, supports expressive [date format pattern](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html#date-format-pattern)
     * @returns {AutoDateHistogramAggregation} returns `this` so that calls can be chained
     */
    format(fmt) {
        this._aggsDef.format = fmt;
        return this;
    }

    /**
     * Sets the missing parameter which defines how documents
     * that are missing a value should be treated.
     *
     * @example
     * const agg = esb.autoDateHistogramAggregation('quantity', 'quantity', 10).missing(0);
     *
     * @param {string} value
     * @returns {AutoDateHistogramAggregation} returns `this` so that calls can be chained
     */
    missing(value) {
        this._aggsDef.missing = value;
        return this;
    }

    /**
     * Date-times are stored in Elasticsearch in UTC.
     * By default, all bucketing and rounding is also done in UTC.
     * The `time_zone` parameter can be used to indicate that bucketing should use a different time zone.
     * Sets the date time zone
     *
     * @example
     * const agg = esb.autoDateHistogramAggregation('by_day', 'date', 15).timeZone(
     *     '-01:00'
     * );
     *
     * @param {string} tz Time zone. Time zones may either be specified
     * as an ISO 8601 UTC offset (e.g. +01:00 or -08:00) or as a timezone id,
     * an identifier used in the TZ database like America/Los_Angeles.
     * @returns {AutoDateHistogramAggregation} returns `this` so that calls can be chained
     */
    timeZone(tz) {
        this._aggsDef.time_zone = tz;
        return this;
    }
}

module.exports = AutoDateHistogramAggregation;

},{"./bucket-aggregation-base":4,"lodash.isnil":183}],4:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Aggregation,
    Script,
    util: { checkType }
} = require('../../core');

/**
 * The `BucketAggregationBase` provides support for common options used across
 * various bucket `Aggregation` implementations.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} name a valid aggregation name
 * @param {string} aggType type of aggregation
 * @param {string=} field The field to aggregate on
 *
 * @extends Aggregation
 */
class BucketAggregationBase extends Aggregation {
    // eslint-disable-next-line require-jsdoc
    constructor(name, aggType, field) {
        super(name, aggType);

        if (!isNil(field)) this._aggsDef.field = field;
    }

    /**
     * Sets field to run aggregation on.
     *
     * @param {string} field a valid field name
     * @returns {BucketAggregationBase} returns `this` so that calls can be chained
     */
    field(field) {
        this._aggsDef.field = field;
        return this;
    }

    /**
     * Sets script parameter for aggregation.
     *
     * @example
     * // Generating the terms using a script
     * const agg = esb.termsAggregation('genres').script(
     *     esb.script('file', 'my_script').params({ field: 'genre' })
     * );
     *
     * @example
     * // Value script
     * const agg = esb.termsAggregation('genres', 'genre').script(
     *     esb.script('inline', "'Genre: ' +_value").lang('painless')
     * );
     *
     * @param {Script} script
     * @returns {BucketAggregationBase} returns `this` so that calls can be chained
     * @throws {TypeError} If `script` is not an instance of `Script`
     */
    script(script) {
        checkType(script, Script);
        this._aggsDef.script = script;
        return this;
    }
}

module.exports = BucketAggregationBase;

},{"../../core":82,"lodash.isnil":183}],5:[function(require,module,exports){
'use strict';

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-children-aggregation.html';

/**
 * A special single bucket aggregation that enables aggregating
 * from buckets on parent document types to buckets on child documents.
 *
 * This aggregation relies on the `_parent` field in the mapping.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-children-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.termsAggregation('top-tags', 'tags.keyword')
 *             .size(10)
 *             .agg(
 *                 esb.childrenAggregation('to-answers')
 *                     .type('answer')
 *                     .agg(
 *                         esb.termsAggregation(
 *                             'top-names',
 *                             'owner.display_name.keyword'
 *                         ).size(10)
 *                     )
 *             )
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 *
 * @extends BucketAggregationBase
 */
class ChildrenAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name) {
        super(name, 'children');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on ChildrenAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in ChildrenAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on ChildrenAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in ChildrenAggregation');
    }

    /**
     * Sets the child type/mapping for aggregation.
     *
     * @param {string} type The child type that the buckets in the parent space should be mapped to.
     * @returns {ChildrenAggregation} returns `this` so that calls can be chained
     */
    type(type) {
        this._aggsDef.type = type;
        return this;
    }
}

module.exports = ChildrenAggregation;

},{"./bucket-aggregation-base":4}],6:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const ValuesSourceBase = require('./values-source-base');

const REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html#_date_histogram';

/**
 * `DateHistogramValuesSource` is a source for the `CompositeAggregation` that
 * handles date histograms. It works very similar to a histogram aggregation
 * with a slightly different syntax.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html#_date_histogram)
 *
 * @example
 * const valueSrc = esb.CompositeAggregation.dateHistogramValuesSource(
 *   'date', // name
 *   'timestamp', // field
 *   '1d' // interval
 * );
 *
 * @param {string} name
 * @param {string=} field The field to aggregate on
 * @param {string|number=} interval Interval to generate histogram over.
 *
 * @extends ValuesSourceBase
 */
class DateHistogramValuesSource extends ValuesSourceBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field, interval) {
        super('date_histogram', REF_URL, name, field);

        if (!isNil(interval)) this._opts.interval = interval;
    }

    /**
     * Sets the histogram interval. Buckets are generated based on this interval value.
     *
     * @param {string|number} interval Interval to generate histogram over.
     * @returns {DateHistogramValuesSource} returns `this` so that calls can be chained
     */
    interval(interval) {
        this._opts.interval = interval;
        return this;
    }

    /**
     * Calendar-aware intervals are configured with the calendarInterval parameter.
     * The combined interval field for date histograms is deprecated from ES 7.2.
     *
     * @example
     * const agg = esb.dateHistogramValuesSource('by_month', 'date').calendarInterval(
     *     'month'
     * );
     *
     * @param {string} interval Interval to generate histogram over.
     * You can specify calendar intervals using the unit name, such as month, or as
     * a single unit quantity, such as 1M. For example, day and 1d are equivalent.
     * Multiple quantities, such as 2d, are not supported.
     * @returns {DateHistogramValuesSource} returns `this` so that calls can be chained
     */
    calendarInterval(interval) {
        this._opts.calendar_interval = interval;
        return this;
    }

    /**
     * Fixed intervals are configured with the fixedInterval parameter.
     * The combined interval field for date histograms is deprecated from ES 7.2.
     *
     * @example
     * const agg = esb.dateHistogramValuesSource('by_minute', 'date').calendarInterval(
     *     '60s'
     * );
     *
     * @param {string} interval Interval to generate histogram over.
     * Intervals are a fixed number of SI units and never deviate, regardless
     * of where they fall on the calendar. However, it means fixed intervals
     * cannot express other units such as months, since the duration of a
     * month is not a fixed quantity.
     * The accepted units for fixed intervals are:
     * millseconds (ms), seconds (s), minutes (m), hours (h) and days (d).
     * @returns {DateHistogramValuesSource} returns `this` so that calls can be chained
     */
    fixedInterval(interval) {
        this._opts.fixed_interval = interval;
        return this;
    }

    /**
     * Sets the date time zone
     *
     * Date-times are stored in Elasticsearch in UTC. By default, all bucketing
     * and rounding is also done in UTC. The `time_zone` parameter can be used
     * to indicate that bucketing should use a different time zone.
     *
     * @param {string} tz Time zone. Time zones may either be specified
     * as an ISO 8601 UTC offset (e.g. +01:00 or -08:00) or as a timezone id,
     * an identifier used in the TZ database like America/Los_Angeles.
     * @returns {DateHistogramValuesSource} returns `this` so that calls can be chained
     */
    timeZone(tz) {
        this._opts.time_zone = tz;
        return this;
    }

    /**
     * Sets the format expression for `key_as_string` in response buckets.
     * If no format is specified, then it will use the first format specified
     * in the field mapping.
     *
     * @example
     * const valueSrc = esb.CompositeAggregation.valuesSource
     *   .dateHistogram('date', 'timestamp', '1d')
     *   .format('yyyy-MM-dd');
     *
     * @param {string} fmt Format mask to apply on aggregation response.
     * For Date Histograms, supports expressive [date format pattern](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html#date-format-pattern)
     * @returns {DateHistogramValuesSource} returns `this` so that calls can be chained
     */
    format(fmt) {
        this._opts.format = fmt;
        return this;
    }
}

module.exports = DateHistogramValuesSource;

},{"./values-source-base":10,"lodash.isnil":183}],7:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const ValuesSourceBase = require('./values-source-base');

const REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html#_histogram';

/**
 * `HistogramValuesSource` is a source for the `CompositeAggregation` that handles
 * histograms. It works very similar to a histogram aggregation with a slightly
 * different syntax.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html#_histogram)
 *
 * @example
 * const valueSrc = esb.CompositeAggregation.histogramValuesSource(
 *   'histo', // name
 *   'price', // field
 *   5 // interval
 * );
 *
 * @param {string} name
 * @param {string=} field The field to aggregate on
 * @param {number=} interval Interval to generate histogram over.
 *
 * @extends ValuesSourceBase
 */
class HistogramValuesSource extends ValuesSourceBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field, interval) {
        super('histogram', REF_URL, name, field);

        if (!isNil(interval)) this._opts.interval = interval;
    }

    /**
     * Sets the histogram interval. Buckets are generated based on this interval value.
     *
     * @param {number} interval Interval to generate histogram over.
     * @returns {HistogramValuesSource} returns `this` so that calls can be chained
     */
    interval(interval) {
        this._opts.interval = interval;
        return this;
    }
}

module.exports = HistogramValuesSource;

},{"./values-source-base":10,"lodash.isnil":183}],8:[function(require,module,exports){
'use strict';

exports.ValuesSourceBase = require('./values-source-base');

exports.TermsValuesSource = require('./terms-values-source');
exports.HistogramValuesSource = require('./histogram-values-source');
exports.DateHistogramValuesSource = require('./date-histogram-values-source');

},{"./date-histogram-values-source":6,"./histogram-values-source":7,"./terms-values-source":9,"./values-source-base":10}],9:[function(require,module,exports){
'use strict';

const ValuesSourceBase = require('./values-source-base');

const REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html#_terms';

/**
 * `TermsValuesSource` is a source for the `CompositeAggregation` that handles
 * terms. It works very similar to a terms aggregation with a slightly different
 * syntax.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html#_terms)
 *
 * @example
 * const valueSrc = esb.CompositeAggregation.termsValuesSource('product').script({
 *   source: "doc['product'].value",
 *   lang: 'painless'
 * });
 *
 * @param {string} name
 * @param {string=} field The field to aggregate on
 *
 * @extends ValuesSourceBase
 */
class TermsValuesSource extends ValuesSourceBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super('terms', REF_URL, name, field);
    }
}

module.exports = TermsValuesSource;

},{"./values-source-base":10}],10:[function(require,module,exports){
'use strict';

const isEmpty = require('lodash.isempty');
const isNil = require('lodash.isnil');

const {
    util: { invalidParam, recursiveToJSON }
} = require('../../../core');

const invalidOrderParam = invalidParam('', 'order', "'asc' or 'desc'");

/**
 * Base class implementation for all Composite Aggregation values sources.
 *
 * **NOTE:** Instantiating this directly should not be required.
 *
 * @param {string} valueSrcType Type of value source
 * @param {string} refUrl Elasticsearch reference URL
 * @param {string} name
 * @param {string=} field The field to aggregate on
 *
 * @throws {Error} if `name` is empty
 * @throws {Error} if `valueSrcType` is empty
 */
class ValuesSourceBase {
    // eslint-disable-next-line require-jsdoc
    constructor(valueSrcType, refUrl, name, field) {
        if (isEmpty(valueSrcType))
            throw new Error('ValuesSourceBase `valueSrcType` cannot be empty');

        this._name = name;
        this._valueSrcType = valueSrcType;
        this._refUrl = refUrl;

        this._body = {};
        this._opts = this._body[valueSrcType] = {};

        if (!isNil(field)) this._opts.field = field;
    }

    /**
     * Field to use for this source.
     *
     * @param {string} field a valid field name
     * @returns {ValuesSourceBase} returns `this` so that calls can be chained
     */
    field(field) {
        this._opts.field = field;
        return this;
    }

    /**
     * Script to use for this source.
     *
     * @param {Script|Object|string} script
     * @returns {ValuesSourceBase} returns `this` so that calls can be chained
     * @throws {TypeError} If `script` is not an instance of `Script`
     */
    script(script) {
        this._opts.script = script;
        return this;
    }

    /**
     * Specifies the type of values produced by this source, e.g. `string` or
     * `date`.
     *
     * @param {string} valueType
     * @returns {ValuesSourceBase} returns `this` so that calls can be chained
     */
    valueType(valueType) {
        this._opts.value_type = valueType;
        return this;
    }

    /**
     * Order specifies the order in the values produced by this source. It can
     * be either `asc` or `desc`.
     *
     * @param {string} order The `order` option can have the following values.
     * `asc`, `desc` to sort in ascending, descending order respectively.
     * @returns {ValuesSourceBase} returns `this` so that calls can be chained.
     */
    order(order) {
        if (isNil(order)) invalidOrderParam(order, this._refUrl);

        const orderLower = order.toLowerCase();
        if (orderLower !== 'asc' && orderLower !== 'desc') {
            invalidOrderParam(order, this._refUrl);
        }

        this._opts.order = orderLower;
        return this;
    }

    /**
     * Missing specifies the value to use when the source finds a missing value
     * in a document.
     *
     * Note: This option was deprecated in
     * [Elasticsearch v6](https://www.elastic.co/guide/en/elasticsearch/reference/6.8/breaking-changes-6.0.html#_literal_missing_literal_is_deprecated_in_the_literal_composite_literal_aggregation).
     * From 6.4 and later, use `missing_bucket` instead.
     *
     * @param {string|number} value
     * @returns {ValuesSourceBase} returns `this` so that calls can be chained
     */
    missing(value) {
        this._opts.missing = value;
        return this;
    }

    /**
     * Specifies whether to include documents without a value for a given source
     * in the response. Defaults to `false` (not included).
     *
     * Note: This method is incompatible with elasticsearch 6.3 and older.
     * Use it only with elasticsearch 6.4 and later.
     *
     * @param {boolean} value
     * @returns {ValuesSourceBase} returns `this` so that calls can be chained
     */
    missingBucket(value) {
        this._opts.missing_bucket = value;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for the Composite
     * Aggregation values source.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        return { [this._name]: recursiveToJSON(this._body) };
    }
}

module.exports = ValuesSourceBase;

},{"../../../core":82,"lodash.isempty":182,"lodash.isnil":183}],11:[function(require,module,exports){
'use strict';

const {
    Aggregation,
    util: { checkType, constructorWrapper }
} = require('../../core');

const {
    ValuesSourceBase,
    TermsValuesSource,
    HistogramValuesSource,
    DateHistogramValuesSource
} = require('./composite-agg-values-sources');

/**
 * CompositeAggregation is a multi-bucket values source based aggregation that
 * can be used to calculate unique composite values from source documents.
 *
 * Unlike the other multi-bucket aggregation the composite aggregation can be
 * used to paginate **all** buckets from a multi-level aggregation efficiently.
 * This aggregation provides a way to stream **all** buckets of a specific
 * aggregation similarly to what scroll does for documents.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *   .agg(
 *     esb.compositeAggregation('my_buckets')
 *       .sources(
 *         esb.CompositeAggregation.termsValuesSource('product', 'product')
 *       )
 *   )
 *
 * NOTE: This query was added in elasticsearch v6.1.
 *
 * @param {string} name a valid aggregation name
 *
 * @extends Aggregation
 */
class CompositeAggregation extends Aggregation {
    // eslint-disable-next-line require-jsdoc
    constructor(name) {
        super(name, 'composite');

        this._aggsDef.sources = [];
    }

    /**
     * Specifies the Composite Aggregation values sources to use in the
     * aggregation.
     *
     * @example
     * const { CompositeAggregation } = esb;
     * const reqBody = esb.requestBodySearch()
     *   .agg(
     *     esb.compositeAggregation('my_buckets')
     *       .sources(
     *         CompositeAggregation.dateHistogramValuesSource(
     *           'date',
     *           'timestamp',
     *           '1d'
     *         ),
     *         CompositeAggregation.termsValuesSource('product', 'product')
     *       )
     *   );
     *
     * @param {...ValuesSourceBase} sources
     * @returns {CompositeAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If any of the rest parameters `sources` is not an
     * instance of `ValuesSourceBase`
     */
    sources(...sources) {
        sources.forEach(valueSrc => checkType(valueSrc, ValuesSourceBase));

        this._aggsDef.sources = this._aggsDef.sources.concat(sources);
        return this;
    }

    /**
     * Defines how many composite buckets should be returned. Each composite
     * bucket is considered as a single bucket so setting a size of 10 will
     * return the first 10 composite buckets created from the values source. The
     * response contains the values for each composite bucket in an array
     * containing the values extracted from each value source.
     *
     * @param {number} size
     * @returns {CompositeAggregation} returns `this` so that calls can be chained
     */
    size(size) {
        this._aggsDef.size = size;
        return this;
    }

    /**
     * The `after` parameter can be used to retrieve the composite buckets that
     * are after the last composite buckets returned in a previous round.
     *
     * @example
     * const { CompositeAggregation } = esb;
     * const reqBody = esb.requestBodySearch().agg(
     *   esb.compositeAggregation('my_buckets')
     *     .size(2)
     *     .sources(
     *       CompositeAggregation.dateHistogramValuesSource(
     *         'date',
     *         'timestamp',
     *         '1d'
     *       ).order('desc'),
     *       CompositeAggregation.termsValuesSource('product', 'product').order('asc')
     *     )
     *     .after({ date: 1494288000000, product: 'mad max' })
     * );
     *
     * @param {Object} afterKey
     * @returns {CompositeAggregation} returns `this` so that calls can be chained
     */
    after(afterKey) {
        this._aggsDef.after = afterKey;
        return this;
    }
}

CompositeAggregation.TermsValuesSource = TermsValuesSource;
CompositeAggregation.termsValuesSource = constructorWrapper(TermsValuesSource);

CompositeAggregation.HistogramValuesSource = HistogramValuesSource;
CompositeAggregation.histogramValuesSource = constructorWrapper(
    HistogramValuesSource
);

CompositeAggregation.DateHistogramValuesSource = DateHistogramValuesSource;
CompositeAggregation.dateHistogramValuesSource = constructorWrapper(
    DateHistogramValuesSource
);

module.exports = CompositeAggregation;

},{"../../core":82,"./composite-agg-values-sources":8}],12:[function(require,module,exports){
'use strict';

const HistogramAggregationBase = require('./histogram-aggregation-base');

/**
 * A multi-bucket aggregation similar to the histogram except it can only be applied on date values.
 * The interval can be specified by date/time expressions.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-datehistogram-aggregation.html#_scripts)
 *
 * @example
 * const agg = esb.dateHistogramAggregation('sales_over_time', 'date', 'month');
 *
 * @example
 * const agg = esb.dateHistogramAggregation(
 *     'sales_over_time',
 *     'date',
 *     '1M'
 * ).format('yyyy-MM-dd');
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 * @param {string=} interval Interval to generate histogram over.
 * Available expressions for interval: year, quarter, month, week, day, hour, minute, second
 *
 * @extends HistogramAggregationBase
 */
class DateHistogramAggregation extends HistogramAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field, interval) {
        super(name, 'date_histogram', field, interval);
    }

    /**
     * Date-times are stored in Elasticsearch in UTC.
     * By default, all bucketing and rounding is also done in UTC.
     * The `time_zone` parameter can be used to indicate that bucketing should use a different time zone.
     * Sets the date time zone
     *
     * @example
     * const agg = esb.dateHistogramAggregation('by_day', 'date', 'day').timeZone(
     *     '-01:00'
     * );
     *
     * @param {string} tz Time zone. Time zones may either be specified
     * as an ISO 8601 UTC offset (e.g. +01:00 or -08:00) or as a timezone id,
     * an identifier used in the TZ database like America/Los_Angeles.
     * @returns {DateHistogramAggregation} returns `this` so that calls can be chained
     */
    timeZone(tz) {
        this._aggsDef.time_zone = tz;
        return this;
    }

    /**
     * Calendar-aware intervals are configured with the calendarInterval parameter.
     * The combined interval field for date histograms is deprecated from ES 7.2.
     *
     * @example
     * const agg = esb.dateHistogramAggregation('by_month', 'date').calendarInterval(
     *     'month'
     * );
     *
     * @param {string} interval Interval to generate histogram over.
     * You can specify calendar intervals using the unit name, such as month, or as
     * a single unit quantity, such as 1M. For example, day and 1d are equivalent.
     * Multiple quantities, such as 2d, are not supported.
     * @returns {DateHistogramAggregation} returns `this` so that calls can be chained
     */
    calendarInterval(interval) {
        this._aggsDef.calendar_interval = interval;
        return this;
    }

    /**
     * Fixed intervals are configured with the fixedInterval parameter.
     * The combined interval field for date histograms is deprecated from ES 7.2.
     *
     * @param {string} interval Interval to generate histogram over.
     * Intervals are a fixed number of SI units and never deviate, regardless
     * of where they fall on the calendar. However, it means fixed intervals
     * cannot express other units such as months, since the duration of a
     * month is not a fixed quantity.
     *
     * @example
     * const agg = esb.dateHistogramAggregation('by_minute', 'date').calendarInterval(
     *     '60s'
     * );
     *
     * The accepted units for fixed intervals are:
     * millseconds (ms), seconds (s), minutes (m), hours (h) and days (d).
     * @returns {DateHistogramAggregation} returns `this` so that calls can be chained
     */
    fixedInterval(interval) {
        this._aggsDef.fixed_interval = interval;
        return this;
    }
}

module.exports = DateHistogramAggregation;

},{"./histogram-aggregation-base":22}],13:[function(require,module,exports){
'use strict';

const RangeAggregationBase = require('./range-aggregation-base');

/**
 * A range aggregation that is dedicated for date values. The main difference
 * between this aggregation and the normal range aggregation is that the from
 * and to values can be expressed in Date Math expressions, and it is also
 * possible to specify a date format by which the from and to response fields
 * will be returned.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html)
 *
 * @example
 * const agg = esb.dateRangeAggregation('range', 'date')
 *     .format('MM-yyy')
 *     .ranges([{ to: 'now-10M/M' }, { from: 'now-10M/M' }]);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends RangeAggregationBase
 */
class DateRangeAggregation extends RangeAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'date_range', field);
    }

    /**
     * Sets the date time zone.
     * Date-times are stored in Elasticsearch in UTC.
     * By default, all bucketing and rounding is also done in UTC.
     * The `time_zone` parameter can be used to indicate that
     * bucketing should use a different time zone.
     *
     * @example
     * const agg = esb.dateRangeAggregation('range', 'date')
     *     .timeZone('CET')
     *     .ranges([
     *         { to: '2016/02/01' },
     *         { from: '2016/02/01', to: 'now/d' },
     *         { from: 'now/d' }
     *     ]);
     *
     * @param {string} tz Time zone. Time zones may either be specified
     * as an ISO 8601 UTC offset (e.g. +01:00 or -08:00) or as a timezone id,
     * an identifier used in the TZ database like America/Los_Angeles.
     * @returns {DateRangeAggregation} returns `this` so that calls can be chained
     */
    timeZone(tz) {
        this._aggsDef.time_zone = tz;
        return this;
    }
}

module.exports = DateRangeAggregation;

},{"./range-aggregation-base":29}],14:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { invalidParam },
    consts: { EXECUTION_HINT_SET }
} = require('../../core');

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-diversified-sampler-aggregation.html';

const invalidExecutionHintParam = invalidParam(
    ES_REF_URL,
    'execution_hint',
    EXECUTION_HINT_SET
);

/**
 * A filtering aggregation used to limit any sub aggregations' processing
 * to a sample of the top-scoring documents. Diversity settings
 * are used to limit the number of matches that share a common value such as an "author".
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-diversified-sampler-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.queryStringQuery('tags:elasticsearch'))
 *     .agg(
 *         esb.diversifiedSamplerAggregation('my_unbiased_sample', 'author')
 *             .shardSize(200)
 *             .agg(
 *                 esb.significantTermsAggregation(
 *                     'keywords',
 *                     'tags'
 *                 ).exclude(['elasticsearch'])
 *             )
 *     );
 *
 * @example
 * // Use a script to produce a hash of the multiple values in a tags field
 * // to ensure we don't have a sample that consists of the same repeated
 * // combinations of tags
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.queryStringQuery('tags:kibana'))
 *     .agg(
 *         esb.diversifiedSamplerAggregation('my_unbiased_sample')
 *             .shardSize(200)
 *             .maxDocsPerValue(3)
 *             .script(esb.script('inline', "doc['tags'].values.hashCode()"))
 *             .agg(
 *                 esb.significantTermsAggregation(
 *                     'keywords',
 *                     'tags'
 *                 ).exclude(['kibana'])
 *             )
 *     );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends BucketAggregationBase
 */
class DiversifiedSamplerAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'diversified_sampler', field);
    }

    /**
     * The shard_size parameter limits how many top-scoring documents
     * are collected in the sample processed on each shard. The default value is 100.
     *
     * @param {number} size Maximum number of documents to return from each shard(Integer)
     * @returns {DiversifiedSamplerAggregation} returns `this` so that calls can be chained
     */
    shardSize(size) {
        this._aggsDef.shard_size = size;
        return this;
    }

    /**
     * Used to control the maximum number of documents collected
     * on any one shard which share a common value.
     * Applies on a per-shard basis only for the purposes of shard-local sampling.
     *
     * @param {number} maxDocsPerValue Default 1.(Integer)
     * @returns {DiversifiedSamplerAggregation} returns `this` so that calls can be chained
     */
    maxDocsPerValue(maxDocsPerValue) {
        this._aggsDef.max_docs_per_value = maxDocsPerValue;
        return this;
    }

    /**
     * This setting can influence the management of the values used
     * for de-duplication. Each option will hold up to shard_size
     * values in memory while performing de-duplication but
     * the type of value held can be controlled
     *
     * @param {string} hint the possible values are `map`, `global_ordinals`,
     * `global_ordinals_hash` and `global_ordinals_low_cardinality`
     * @returns {DiversifiedSamplerAggregation} returns `this` so that calls can be chained
     * @throws {Error} If Execution Hint is outside the accepted set.
     */
    executionHint(hint) {
        if (isNil(hint)) invalidExecutionHintParam(hint);

        const hintLower = hint.toLowerCase();
        if (!EXECUTION_HINT_SET.has(hintLower)) {
            invalidExecutionHintParam(hint);
        }

        this._aggsDef.execution_hint = hintLower;
        return this;
    }
}

module.exports = DiversifiedSamplerAggregation;

},{"../../core":82,"./bucket-aggregation-base":4,"lodash.isnil":183}],15:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Query,
    util: { checkType }
} = require('../../core');

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filter-aggregation.html';

/**
 * Defines a single bucket of all the documents in the current document set
 * context that match a specified filter. Often this will be used to narrow down
 * the current aggregation context to a specific set of documents.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filter-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.filterAggregation(
 *             't_shirts',
 *             esb.termQuery('type', 't-shirt')
 *         ).agg(esb.avgAggregation('avg_price', 'price'))
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {Query=} filterQuery Query to filter on. Example - term query.
 *
 * @extends BucketAggregationBase
 */
class FilterAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, filterQuery) {
        super(name, 'filter');

        if (!isNil(filterQuery)) this.filter(filterQuery);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on FilterAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in FilterAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on FilterAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in FilterAggregation');
    }

    // NOTE: Special case. filter does not set a key inside
    // this._aggsDef but sets the entire object itself
    // Generic getOpt will fail for this.
    // Just a simple override should handle it though

    /**
     * Set the filter query for Filter Aggregation.
     *
     * @param {Query} filterQuery Query to filter on. Example - term query.
     * @returns {FilterAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `filterQuery` is not an instance of `Query`
     */
    filter(filterQuery) {
        checkType(filterQuery, Query);
        this._aggsDef = this._aggs[this.aggType] = filterQuery;
        return this;
    }
}

module.exports = FilterAggregation;

},{"../../core":82,"./bucket-aggregation-base":4,"lodash.isnil":183}],16:[function(require,module,exports){
'use strict';

const isEmpty = require('lodash.isempty');

const {
    Query,
    util: { checkType, setDefault }
} = require('../../core');

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filters-aggregation.html';

/**
 * Defines a single bucket of all the documents in the current document set
 * context that match a specified filter. Often this will be used to narrow down
 * the current aggregation context to a specific set of documents.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filters-aggregation.html)
 *
 * @example
 * const agg = esb.filtersAggregation('messages')
 *     .filter('errors', esb.matchQuery('body', 'error'))
 *     .filter('warnings', esb.matchQuery('body', 'warning'));
 *
 *
 * @example
 * const agg = esb.filtersAggregation('messages')
 *     .anonymousFilters([
 *         esb.matchQuery('body', 'error'),
 *         esb.matchQuery('body', 'warning')
 *     ])
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 *
 * @extends BucketAggregationBase
 */
class FiltersAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name) {
        super(name, 'filters');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on FiltersAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in FiltersAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on FiltersAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in FiltersAggregation');
    }

    /**
     * Print warning message to console namespaced by class name.
     *
     * @param {string} msg
     * @private
     */
    _warn(msg) {
        console.warn(`[FiltersAggregation] ${msg}`);
    }

    /**
     * Check and puts an object for the `filters` key in
     * internal aggregation representation object.
     * If the key has a value but is not an object,
     * a warning is printed.
     * @private
     */
    _checkNamedFilters() {
        if (
            !setDefault(this._aggsDef, 'filters', {}) &&
            Array.isArray(this._aggsDef.filters)
        ) {
            this._warn('Do not mix named and anonymous filters!');
            this._warn('Overwriting anonymous filters.');
            this._aggsDef.filters = {};
        }
    }

    /**
     * Check and puts an array for the `filters` key in
     * internal aggregation representation object.
     * If the key has a value but is not an array,
     * a warning is printed.
     * @private
     */
    _checkAnonymousFilters() {
        if (
            !setDefault(this._aggsDef, 'filters', []) &&
            !Array.isArray(this._aggsDef.filters)
        ) {
            this._warn('Do not mix named and anonymous filters!');
            this._warn('Overwriting named filters.');
            this._aggsDef.filters = [];
        }
    }

    /**
     * Sets a named filter query.
     * Does not mix with anonymous filters.
     * If anonymous filters are present, they will be overwritten.
     *
     * @param {string} bucketName Name for bucket which will collect
     * all documents that match its associated filter.
     * @param {Query} filterQuery Query to filter on. Example - term query.
     * @returns {FiltersAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `filterQuery` is not an instance of `Query`
     */
    filter(bucketName, filterQuery) {
        checkType(filterQuery, Query);

        this._checkNamedFilters();

        this._aggsDef.filters[bucketName] = filterQuery;
        return this;
    }

    /**
     * Assigns filters to already added filters.
     * Does not mix with anonymous filters.
     * If anonymous filters are present, they will be overwritten.
     *
     * @param {Object} filterQueries Object with multiple key value pairs
     * where bucket name is the key and filter query is the value.
     * @returns {FiltersAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `filterQueries` is not an instance of object
     */
    filters(filterQueries) {
        checkType(filterQueries, Object);

        this._checkNamedFilters();

        Object.assign(this._aggsDef.filters, filterQueries);
        return this;
    }

    /**
     * Appends an anonymous filter query.
     * Does not mix with named filters.
     * If named filters are present, they will be overwritten.
     *
     * @param {*} filterQuery Query to filter on. Example - term query.
     * @returns {FiltersAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `filterQuery` is not an instance of `Query`
     */
    anonymousFilter(filterQuery) {
        checkType(filterQuery, Query);

        this._checkAnonymousFilters();

        this._aggsDef.filters.push(filterQuery);
        return this;
    }

    /**
     * Appends an array of anonymous filters.
     * Does not mix with named filters.
     * If named filters are present, they will be overwritten.
     *
     * @param {*} filterQueries Array of queries to filter on and generate buckets.
     * Example - term query.
     * @returns {FiltersAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `filterQueries` is not an instance of Array
     */
    anonymousFilters(filterQueries) {
        checkType(filterQueries, Array);

        this._checkAnonymousFilters();

        this._aggsDef.filters = this._aggsDef.filters.concat(filterQueries);
        return this;
    }

    /**
     * Adds a bucket to the response which will contain all documents
     * that do not match any of the given filters.
     * Returns the other bucket bucket either in a bucket
     * (named `_other_` by default) if named filters are being used,
     * or as the last bucket if anonymous filters are being used
     *
     * @param {boolean} enable `True` to return `other` bucket with documents
     * that do not match any filters and `False` to disable computation
     * @param {string=} otherBucketKey Optional key for the other bucket.
     * Default is `_other_`.
     * @returns {FiltersAggregation} returns `this` so that calls can be chained
     */
    otherBucket(enable, otherBucketKey) {
        this._aggsDef.other_bucket = enable;

        !isEmpty(otherBucketKey) && this.otherBucketKey(otherBucketKey);

        return this;
    }

    /**
     * Sets the key for the other bucket to a value other than the default `_other_`.
     * Setting this parameter will implicitly set the other_bucket parameter to true.
     * If anonymous filters are being used, setting this parameter will not make sense.
     *
     * @example
     * const agg = esb.filtersAggregation('messages')
     *     .filter('errors', esb.matchQuery('body', 'error'))
     *     .filter('warnings', esb.matchQuery('body', 'warning'))
     *     .otherBucketKey('other_messages');
     *
     * @param {string} otherBucketKey
     * @returns {FiltersAggregation} returns `this` so that calls can be chained
     */
    otherBucketKey(otherBucketKey) {
        this._aggsDef.other_bucket_key = otherBucketKey;
        return this;
    }
}

module.exports = FiltersAggregation;

},{"../../core":82,"./bucket-aggregation-base":4,"lodash.isempty":182}],17:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    GeoPoint,
    util: { checkType, invalidParam },
    consts: { UNIT_SET }
} = require('../../core');

const RangeAggregationBase = require('./range-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geodistance-aggregation.html';

const invalidUnitParam = invalidParam(ES_REF_URL, 'unit', UNIT_SET);
const invalidDistanceTypeParam = invalidParam(
    ES_REF_URL,
    'distance_type',
    "'plane' or 'arc'"
);

/**
 * A multi-bucket aggregation that works on geo_point fields and conceptually
 * works very similar to the range aggregation. The user can define a point of
 * origin and a set of distance range buckets. The aggregation evaluate the
 * distance of each document value from the origin point and determines the
 * buckets it belongs to based on the ranges (a document belongs to a bucket
 * if the distance between the document and the origin falls within the distance
 * range of the bucket).
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geodistance-aggregation.html)
 *
 * @example
 * const agg = esb.geoDistanceAggregation('rings_around_amsterdam', 'location')
 *     .origin(esb.geoPoint().string('52.3760, 4.894'))
 *     .ranges([{ to: 100000 }, { from: 100000, to: 300000 }, { from: 300000 }]);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends RangeAggregationBase
 */
class GeoDistanceAggregation extends RangeAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'geo_distance', field);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoDistanceAggregation
     */
    format() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in GeoDistanceAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoDistanceAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in GeoDistanceAggregation');
    }

    /**
     * Sets the point of origin from where distances will be measured.
     *
     * @param {GeoPoint} point A valid `GeoPoint` object.
     * @returns {GeoDistanceAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `point` is not an instance of `GeoPoint`
     */
    origin(point) {
        checkType(point, GeoPoint);

        this._aggsDef.origin = point;
        return this;
    }

    /**
     * Sets the distance unit.  Valid values are:
     * mi (miles), in (inches), yd (yards),
     * km (kilometers), cm (centimeters), mm (millimeters),
     * ft(feet), NM(nauticalmiles)
     *
     * @example
     * const agg = esb.geoDistanceAggregation('rings_around_amsterdam', 'location')
     *     .origin(esb.geoPoint().string('52.3760, 4.894'))
     *     .unit('km')
     *     .ranges([{ to: 100 }, { from: 100, to: 300 }, { from: 300 }]);
     *
     * @param {string} unit Distance unit, default is `m`(meters).
     * @returns {GeoDistanceAggregation} returns `this` so that calls can be chained
     * @throws {Error} If Unit is outside the accepted set.
     */
    unit(unit) {
        if (!UNIT_SET.has(unit)) {
            invalidUnitParam(unit);
        }

        this._aggsDef.unit = unit;
        return this;
    }

    /**
     * Sets the distance calculation mode, `arc` or `plane`.
     * The `arc` calculation is the more accurate.
     * The `plane` is the faster but least accurate.
     *
     * @example
     * const agg = esb.geoDistanceAggregation('rings_around_amsterdam', 'location')
     *     .origin(esb.geoPoint().string('52.3760, 4.894'))
     *     .unit('km')
     *     .distanceType('plane')
     *     .ranges([{ to: 100 }, { from: 100, to: 300 }, { from: 300 }]);
     *
     * @param {string} type
     * @returns {GeoDistanceAggregation} returns `this` so that calls can be chained
     * @throws {Error} If `type` is neither `plane` nor `arc`.
     */
    distanceType(type) {
        if (isNil(type)) invalidDistanceTypeParam(type);

        const typeLower = type.toLowerCase();
        if (typeLower !== 'plane' && typeLower !== 'arc')
            invalidDistanceTypeParam(type);

        this._aggsDef.distance_type = typeLower;
        return this;
    }
}

module.exports = GeoDistanceAggregation;

},{"../../core":82,"./range-aggregation-base":29,"lodash.isnil":183}],18:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geohashgrid-aggregation.html';

/**
 * A multi-bucket aggregation that works on geo_point fields and groups points
 * into buckets that represent cells in a grid. The resulting grid can be sparse
 * and only contains cells that have matching data. Each cell is labeled using a
 * geohash which is of user-definable precision.

 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geohashgrid-aggregation.html)
 *
 * @example
 * const agg = esb.geoHashGridAggregation('large-grid', 'location').precision(3);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends BucketAggregationBase
 */
class GeoHashGridAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'geohash_grid', field);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoHashGridAggregation
     */
    format() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in GeoHashGridAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoHashGridAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in GeoHashGridAggregation');
    }

    /**
     * Sets the precision for the generated geohash.
     *
     * @param {number} precision Precision can be between 1 and 12
     * @returns {GeoHashGridAggregation} returns `this` so that calls can be chained
     * @throws {Error} If precision is not between 1 and 12.
     */
    precision(precision) {
        if (isNil(precision) || precision < 1 || precision > 12) {
            throw new Error('`precision` can only be value from 1 to 12.');
        }

        this._aggsDef.precision = precision;
        return this;
    }

    /**
     * Sets the maximum number of geohash buckets to return.
     * When results are trimmed, buckets are prioritised
     * based on the volumes of documents they contain.
     *
     * @param {number} size Optional. The maximum number of geohash
     * buckets to return (defaults to 10,000).
     * @returns {GeoHashGridAggregation} returns `this` so that calls can be chained
     */
    size(size) {
        this._aggsDef.size = size;
        return this;
    }

    /**
     * Determines how many geohash_grid the coordinating node
     * will request from each shard.
     *
     * @param {number} shardSize Optional.
     * @returns {GeoHashGridAggregation} returns `this` so that calls can be chained
     */
    shardSize(shardSize) {
        this._aggsDef.shard_size = shardSize;
        return this;
    }
}

module.exports = GeoHashGridAggregation;

},{"./bucket-aggregation-base":4,"lodash.isnil":183}],19:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geohexgrid-aggregation.html';

/**
 * A multi-bucket aggregation that groups geo_point and geo_shape values into buckets
 * that represent a grid. The resulting grid can be sparse and only contains cells
 * that have matching data. Each cell corresponds to a H3 cell index and is labeled
 * using the H3Index representation.

 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geohexgrid-aggregation.html)
 *
 * NOTE: This aggregation was added in elasticsearch v8.1.0.
 *
 * @example
 * const agg = esb.geoHexGridAggregation('hex-grid', 'location').precision(3);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends BucketAggregationBase
 */
class GeoHexGridAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'geohex_grid', field);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoHexGridAggregation
     */
    format() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in GeoHexGridAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoHexGridAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in GeoHexGridAggregation');
    }

    /**
     * Sets the precision for the generated geohex.
     *
     * @param {number} precision Precision can be between 0 and 15
     * @returns {GeoHexGridAggregation} returns `this` so that calls can be chained
     * @throws {Error} If precision is not between 0 and 15.
     */
    precision(precision) {
        if (isNil(precision) || precision < 0 || precision > 15) {
            throw new Error('`precision` can only be value from 0 to 15.');
        }

        this._aggsDef.precision = precision;
        return this;
    }

    /**
     * Sets the maximum number of geohex buckets to return.
     * When results are trimmed, buckets are prioritised
     * based on the volumes of documents they contain.
     *
     * @param {number} size Optional. The maximum number of geohex
     * buckets to return (defaults to 10,000).
     * @returns {GeoHexGridAggregation} returns `this` so that calls can be chained
     */
    size(size) {
        this._aggsDef.size = size;
        return this;
    }

    /**
     * Determines how many geohex_grid the coordinating node
     * will request from each shard.
     *
     * @param {number} shardSize Optional.
     * @returns {GeoHexGridAggregation} returns `this` so that calls can be chained
     */
    shardSize(shardSize) {
        this._aggsDef.shard_size = shardSize;
        return this;
    }
}

module.exports = GeoHexGridAggregation;

},{"./bucket-aggregation-base":4,"lodash.isnil":183}],20:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    GeoPoint,
    util: { checkType, setDefault }
} = require('../../core');

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geotilegrid-aggregation.html';

/**
 * A multi-bucket aggregation that works on geo_point fields and groups points
 * into buckets that represent cells in a grid. The resulting grid can be sparse
 * and only contains cells that have matching data. Each cell corresponds to a
 * map tile as used by many online map sites. Each cell is labeled using a
 * "{zoom}/{x}/{y}" format, where zoom is equal to the user-specified precision.

 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geotilegrid-aggregation.html)
 *
 * NOTE: This query was added in elasticsearch v7.0.
 *
 * @example
 * const agg = esb.geoTileGridAggregation('large-grid', 'location').precision(8);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends BucketAggregationBase
 */
class GeoTileGridAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'geotile_grid', field);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoTileGridAggregation
     */
    format() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in GeoTileGridAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoTileGridAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in GeoTileGridAggregation');
    }

    /**
     * The integer zoom of the key used to define cells/buckets in the results.
     * Defaults to 7.
     *
     * @param {number} precision Precision can be between 0 and 29
     * @returns {GeoTileGridAggregation} returns `this` so that calls can be chained
     * @throws {Error} If precision is not between 0 and 29.
     */
    precision(precision) {
        if (isNil(precision) || precision < 0 || precision > 29) {
            throw new Error('`precision` can only be value from 0 to 29.');
        }

        this._aggsDef.precision = precision;
        return this;
    }

    /**
     * Sets the maximum number of geotile buckets to return.
     * When results are trimmed, buckets are prioritised
     * based on the volumes of documents they contain.
     *
     * @param {number} size Optional. The maximum number of geotile
     * buckets to return (defaults to 10,000).
     * @returns {GeoTileGridAggregation} returns `this` so that calls can be chained
     */
    size(size) {
        this._aggsDef.size = size;
        return this;
    }

    /**
     * Determines how many geotile_grid buckets the coordinating node
     * will request from each shard. To allow for more accurate counting of the
     * top cells returned in the final result the aggregation defaults to
     * returning `max(10,(size x number-of-shards))` buckets from each shard.
     * If this heuristic is undesirable, the number considered from each shard
     * can be over-ridden using this parameter.
     *
     * @param {number} shardSize Optional.
     * @returns {GeoTileGridAggregation} returns `this` so that calls can be chained
     */
    shardSize(shardSize) {
        this._aggsDef.shard_size = shardSize;
        return this;
    }

    /**
     * Sets the top left coordinate for the bounding box used to filter the
     * points in the bucket.
     *
     * @param {GeoPoint} point A valid `GeoPoint`
     * @returns {GeoTileGridAggregation} returns `this` so that calls can be chained.
     */
    topLeft(point) {
        checkType(point, GeoPoint);
        setDefault(this._aggsDef, 'bounds', {});
        this._aggsDef.bounds.top_left = point;
        return this;
    }

    /**
     * Sets the bottom right coordinate for the bounding box used to filter the
     * points in the bucket.
     *
     * @param {GeoPoint} point A valid `GeoPoint`
     * @returns {GeoTileGridAggregation} returns `this` so that calls can be chained.
     */
    bottomRight(point) {
        checkType(point, GeoPoint);
        setDefault(this._aggsDef, 'bounds', {});
        this._aggsDef.bounds.bottom_right = point;
        return this;
    }

    /**
     * Sets the top right coordinate for the bounding box used to filter the
     * points in the bucket.
     *
     * @param {GeoPoint} point A valid `GeoPoint`
     * @returns {GeoTileGridAggregation} returns `this` so that calls can be chained.
     */
    topRight(point) {
        checkType(point, GeoPoint);
        setDefault(this._aggsDef, 'bounds', {});
        this._aggsDef.bounds.top_right = point;
        return this;
    }

    /**
     * Sets the bottom left coordinate for the bounding box used to filter the
     * points in the bucket.
     *
     * @param {GeoPoint} point A valid `GeoPoint`
     * @returns {GeoTileGridAggregation} returns `this` so that calls can be chained.
     */
    bottomLeft(point) {
        checkType(point, GeoPoint);
        setDefault(this._aggsDef, 'bounds', {});
        this._aggsDef.bounds.bottom_left = point;
        return this;
    }

    /**
     * Sets value for top of the bounding box.
     *
     * @param {number} val
     * @returns {GeoTileGridAggregation} returns `this` so that calls can be chained.
     */
    top(val) {
        setDefault(this._aggsDef, 'bounds', {});
        this._aggsDef.bounds.top = val;
        return this;
    }

    /**
     * Sets value for left of the bounding box.
     *
     * @param {number} val
     * @returns {GeoTileGridAggregation} returns `this` so that calls can be chained.
     */
    left(val) {
        setDefault(this._aggsDef, 'bounds', {});
        this._aggsDef.bounds.left = val;
        return this;
    }

    /**
     * Sets value for bottom of the bounding box.
     *
     * @param {number} val
     * @returns {GeoTileGridAggregation} returns `this` so that calls can be chained.
     */
    bottom(val) {
        setDefault(this._aggsDef, 'bounds', {});
        this._aggsDef.bounds.bottom = val;
        return this;
    }

    /**
     * Sets value for right of the bounding box.
     *
     * @param {number} val
     * @returns {GeoTileGridAggregation} returns `this` so that calls can be chained.
     */
    right(val) {
        setDefault(this._aggsDef, 'bounds', {});
        this._aggsDef.bounds.right = val;
        return this;
    }
}

module.exports = GeoTileGridAggregation;

},{"../../core":82,"./bucket-aggregation-base":4,"lodash.isnil":183}],21:[function(require,module,exports){
'use strict';

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-global-aggregation.html';

/**
 * Defines a single bucket of all the documents within the search execution
 * context. This context is defined by the indices and the document types you’re
 * searching on, but is not influenced by the search query itself.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-global-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.matchQuery('type', 't-shirt'))
 *     .agg(
 *         esb.globalAggregation('all_products').agg(
 *             esb.avgAggregation('avg_price', 'price')
 *         )
 *     )
 *     .agg(esb.avgAggregation('t_shirts', 'price'));
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 *
 * @extends BucketAggregationBase
 */
class GlobalAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name) {
        super(name, 'global');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GlobalAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in GlobalAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GlobalAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in GlobalAggregation');
    }
}

module.exports = GlobalAggregation;

},{"./bucket-aggregation-base":4}],22:[function(require,module,exports){
'use strict';

const has = require('lodash.has');
const isNil = require('lodash.isnil');

const {
    util: { invalidParam }
} = require('../../core');

const BucketAggregationBase = require('./bucket-aggregation-base');

const invalidDirectionParam = invalidParam('', 'direction', "'asc' or 'desc'");

/**
 * The `HistogramAggregationBase` provides support for common options used across
 * various histogram `Aggregation` implementations like Histogram Aggregation,
 * Date Histogram aggregation.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string} aggType Type of aggregation
 * @param {string=} field The field to aggregate on
 * @param {string|number=} interval Interval to generate histogram over.
 *
 * @extends BucketAggregationBase
 */
class HistogramAggregationBase extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, aggType, field, interval) {
        super(name, aggType, field);

        if (!isNil(interval)) this._aggsDef.interval = interval;
    }

    /**
     * Sets the histogram interval. Buckets are generated based on this interval value.
     *
     * @param {string} interval Interval to generate histogram over.
     * For date histograms, available expressions for interval:
     * year, quarter, month, week, day, hour, minute, second
     * @returns {HistogramAggregationBase} returns `this` so that calls can be chained
     */
    interval(interval) {
        this._aggsDef.interval = interval;
        return this;
    }

    /**
     * Sets the format expression for `key_as_string` in response buckets.
     * If no format is specified, then it will use the first format specified in the field mapping.
     *
     * @example
     * const agg = esb.dateHistogramAggregation(
     *     'sales_over_time',
     *     'date',
     *     '1M'
     * ).format('yyyy-MM-dd');
     *
     * @param {string} fmt Format mask to apply on aggregation response. Example: ####.00.
     * For Date Histograms, supports expressive [date format pattern](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html#date-format-pattern)
     * @returns {HistogramAggregationBase} returns `this` so that calls can be chained
     */
    format(fmt) {
        this._aggsDef.format = fmt;
        return this;
    }

    /**
     * The offset parameter is used to change the start value of each bucket
     * by the specified positive (+) or negative offset (-).
     * Negative offset is not applicable on HistogramAggregation.
     * In case of DateHistogramAggregation, duration can be
     * a value such as 1h for an hour, or 1d for a day.
     *
     * @example
     * const agg = esb.dateHistogramAggregation('by_day', 'date', 'day').offset('6h');
     *
     * @param {string} offset Time or bucket key offset for bucketing.
     * @returns {HistogramAggregationBase} returns `this` so that calls can be chained
     */
    offset(offset) {
        this._aggsDef.offset = offset;
        return this;
    }

    /**
     * Sets the ordering for buckets
     *
     * @example
     * const agg = esb.histogramAggregation('prices', 'price', 50)
     *     .order('_count', 'desc');
     *
     * @example
     * const agg = esb.histogramAggregation('prices', 'price', 50)
     *     .order('promoted_products>rating_stats.avg', 'desc')
     *     .agg(
     *         esb.filterAggregation('promoted_products')
     *             .filter(esb.termQuery('promoted', 'true'))
     *             .agg(esb.statsAggregation('rating_stats', 'rating'))
     *     );
     *
     * @param {string} key
     * @param {string} direction `asc` or `desc`
     * @returns {HistogramAggregationBase} returns `this` so that calls can be chained
     */
    order(key, direction = 'desc') {
        if (isNil(direction)) invalidDirectionParam(direction);

        const directionLower = direction.toLowerCase();
        if (directionLower !== 'asc' && directionLower !== 'desc') {
            invalidDirectionParam(direction);
        }

        if (has(this._aggsDef, 'order')) {
            if (!Array.isArray(this._aggsDef.order)) {
                this._aggsDef.order = [this._aggsDef.order];
            }

            this._aggsDef.order.push({ [key]: directionLower });
        } else {
            this._aggsDef.order = { [key]: directionLower };
        }

        return this;
    }

    /**
     * Sets the minimum number of matching documents in range to return the bucket.
     *
     * @example
     * const agg = esb.histogramAggregation('prices', 'price', 50).minDocCount(1);
     *
     * @param {number} minDocCnt Integer value for minimum number of documents
     * required to return bucket in response
     * @returns {HistogramAggregationBase} returns `this` so that calls can be chained
     */
    minDocCount(minDocCnt) {
        this._aggsDef.min_doc_count = minDocCnt;
        return this;
    }

    /**
     * Set's the range/bounds for the histogram aggregation.
     * Useful when you want to include buckets that might be
     * outside the bounds of indexed documents.
     *
     * @example
     * const agg = esb.histogramAggregation('prices', 'price', 50).extendedBounds(0, 500);
     *
     * @param {number|string} min Start bound / minimum bound value
     * For histogram aggregation, Integer value can be used.
     * For Date histogram, date expression can be used.
     * Available expressions for interval:
     * year, quarter, month, week, day, hour, minute, second
     * @param {number|string} max End bound / maximum bound value
     * For histogram aggregation, Integer value can be used.
     * For Date histogram, date expression can be used.
     * Available expressions for interval:
     * year, quarter, month, week, day, hour, minute, second
     * @returns {HistogramAggregationBase} returns `this` so that calls can be chained
     */
    extendedBounds(min, max) {
        this._aggsDef.extended_bounds = { min, max };
        return this;
    }

    /**
     * Set's the range/bounds for the histogram aggregation.
     * Useful when you want to limit the range of buckets in the histogram.
     * It is particularly useful in the case of open data ranges that can result in a very large number of buckets.
     * NOTE: Only available in Elasticsearch v7.10.0+
     *
     * @example
     * const agg = esb.histogramAggregation('prices', 'price', 50).hardBounds(0, 500);
     *
     * @param {number|string} min Start bound / minimum bound value
     * For histogram aggregation, Integer value can be used.
     * For Date histogram, date expression can be used.
     * Available expressions for interval:
     * year, quarter, month, week, day, hour, minute, second
     * @param {number|string} max End bound / maximum bound value
     * For histogram aggregation, Integer value can be used.
     * For Date histogram, date expression can be used.
     * Available expressions for interval:
     * year, quarter, month, week, day, hour, minute, second
     * @returns {HistogramAggregationBase} returns `this` so that calls can be chained
     */
    hardBounds(min, max) {
        this._aggsDef.hard_bounds = { min, max };
        return this;
    }

    /**
     * Sets the missing parameter which defines how documents
     * that are missing a value should be treated.
     *
     * @example
     * const agg = esb.histogramAggregation('quantity', 'quantity', 10).missing(0);
     *
     * @param {string} value
     * @returns {HistogramAggregationBase} returns `this` so that calls can be chained
     */
    missing(value) {
        this._aggsDef.missing = value;
        return this;
    }

    /**
     * Enable the response to be returned as a keyed object where the key is the
     * bucket interval.
     *
     * @example
     * const agg = esb.dateHistogramAggregation('sales_over_time', 'date', '1M')
     *     .keyed(true)
     *     .format('yyyy-MM-dd');
     *
     * @param {boolean} keyed To enable keyed response or not.
     * @returns {HistogramAggregationBase} returns `this` so that calls can be chained
     */
    keyed(keyed) {
        this._aggsDef.keyed = keyed;
        return this;
    }
}

module.exports = HistogramAggregationBase;

},{"../../core":82,"./bucket-aggregation-base":4,"lodash.has":179,"lodash.isnil":183}],23:[function(require,module,exports){
'use strict';

const HistogramAggregationBase = require('./histogram-aggregation-base');

/**
 * A multi-bucket values source based aggregation that can be applied on
 * numeric values extracted from the documents. It dynamically builds fixed
 * size (a.k.a. interval) buckets over the values.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-histogram-aggregation.html)
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 * @param {number=} interval Interval to generate histogram over.
 *
 * @example
 * const agg = esb.histogramAggregation('prices', 'price', 50);
 *
 * @example
 * const agg = esb.histogramAggregation('prices', 'price', 50).minDocCount(1);
 *
 * @example
 * const agg = esb.histogramAggregation('prices', 'price', 50)
 *     .extendedBounds(0, 500);
 *
 * @example
 * const agg = esb.histogramAggregation('quantity', 'quantity', 10).missing(0);
 *
 * @extends HistogramAggregationBase
 */
class HistogramAggregation extends HistogramAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field, interval) {
        super(name, 'histogram', field, interval);
    }
}

module.exports = HistogramAggregation;

},{"./histogram-aggregation-base":22}],24:[function(require,module,exports){
'use strict';

exports.BucketAggregationBase = require('./bucket-aggregation-base');
exports.HistogramAggregationBase = require('./histogram-aggregation-base');
exports.RangeAggregationBase = require('./range-aggregation-base');
exports.TermsAggregationBase = require('./terms-aggregation-base');
exports.SignificantAggregationBase = require('./significant-aggregation-base');

exports.AdjacencyMatrixAggregation = require('./adjacency-matrix-aggregation');
exports.ChildrenAggregation = require('./children-aggregation');
exports.CompositeAggregation = require('./composite-aggregation');
exports.DateHistogramAggregation = require('./date-histogram-aggregation');
exports.AutoDateHistogramAggregation = require('./auto-date-histogram-aggregation');
exports.VariableWidthHistogramAggregation = require('./variable-width-histogram-aggregation');
exports.DateRangeAggregation = require('./date-range-aggregation');
exports.DiversifiedSamplerAggregation = require('./diversified-sampler-aggregation');
exports.FilterAggregation = require('./filter-aggregation');
exports.FiltersAggregation = require('./filters-aggregation');
exports.GeoDistanceAggregation = require('./geo-distance-aggregation');
exports.GeoHashGridAggregation = require('./geo-hash-grid-aggregation');
exports.GeoHexGridAggregation = require('./geo-hex-grid-aggregation');
exports.GeoTileGridAggregation = require('./geo-tile-grid-aggregation');
exports.GlobalAggregation = require('./global-aggregation');
exports.HistogramAggregation = require('./histogram-aggregation');
exports.IpRangeAggregation = require('./ip-range-aggregation');
exports.MissingAggregation = require('./missing-aggregation');
exports.NestedAggregation = require('./nested-aggregation');
exports.ParentAggregation = require('./parent-aggregation');
exports.RangeAggregation = require('./range-aggregation');
exports.RareTermsAggregation = require('./rare-terms-aggregation');
exports.ReverseNestedAggregation = require('./reverse-nested-aggregation');
exports.SamplerAggregation = require('./sampler-aggregation');
exports.SignificantTermsAggregation = require('./significant-terms-aggregation');
exports.SignificantTextAggregation = require('./significant-text-aggregation');
exports.TermsAggregation = require('./terms-aggregation');

},{"./adjacency-matrix-aggregation":2,"./auto-date-histogram-aggregation":3,"./bucket-aggregation-base":4,"./children-aggregation":5,"./composite-aggregation":11,"./date-histogram-aggregation":12,"./date-range-aggregation":13,"./diversified-sampler-aggregation":14,"./filter-aggregation":15,"./filters-aggregation":16,"./geo-distance-aggregation":17,"./geo-hash-grid-aggregation":18,"./geo-hex-grid-aggregation":19,"./geo-tile-grid-aggregation":20,"./global-aggregation":21,"./histogram-aggregation":23,"./histogram-aggregation-base":22,"./ip-range-aggregation":25,"./missing-aggregation":26,"./nested-aggregation":27,"./parent-aggregation":28,"./range-aggregation":30,"./range-aggregation-base":29,"./rare-terms-aggregation":31,"./reverse-nested-aggregation":32,"./sampler-aggregation":33,"./significant-aggregation-base":34,"./significant-terms-aggregation":35,"./significant-text-aggregation":36,"./terms-aggregation":38,"./terms-aggregation-base":37,"./variable-width-histogram-aggregation":39}],25:[function(require,module,exports){
'use strict';

const RangeAggregationBase = require('./range-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-iprange-aggregation.html';

/**
 * Dedicated range aggregation for IP typed fields.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/5current/search-aggregations-bucket-iprange-aggregation.html)
 *
 * @example
 * const agg = esb.ipRangeAggregation('ip_ranges', 'ip').ranges([
 *     { to: '10.0.0.5' },
 *     { from: '10.0.0.5' }
 * ]);
 *
 * @example
 * const agg = esb.ipRangeAggregation('ip_ranges', 'ip').ranges([
 *     { mask: '10.0.0.0/25' },
 *     { mask: '10.0.0.127/25' }
 * ]);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends RangeAggregationBase
 */
class IpRangeAggregation extends RangeAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'ip_range', field);
        // Variable name is misleading. Only one of these needs to be present.
        this._rangeRequiredKeys = ['from', 'to', 'mask'];
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on IpRangeAggregation
     */
    format() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in IpRangeAggregation');
    }
}

module.exports = IpRangeAggregation;

},{"./range-aggregation-base":29}],26:[function(require,module,exports){
'use strict';

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-missing-aggregation.html';

/**
 * A field data based single bucket aggregation, that creates a bucket of all
 * documents in the current document set context that are missing a field value
 * (effectively, missing a field or having the configured NULL value set).
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-missing-aggregation.html)
 *
 * @example
 * const agg = esb.missingAggregation('products_without_a_price', 'price');
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends BucketAggregationBase
 */
class MissingAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'missing', field);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on MissingAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in MissingAggregation');
    }
}

module.exports = MissingAggregation;

},{"./bucket-aggregation-base":4}],27:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-nested-aggregation.html';

/**
 * A special single bucket aggregation that enables aggregating nested
 * documents.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-nested-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.matchQuery('name', 'led tv'))
 *     .agg(
 *         esb.nestedAggregation('resellers', 'resellers').agg(
 *             esb.minAggregation('min_price', 'resellers.price')
 *         )
 *     );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} path `path` of the nested document
 *
 * @extends BucketAggregationBase
 */
class NestedAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, path) {
        super(name, 'nested');

        if (!isNil(path)) this._aggsDef.path = path;
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on NestedAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in NestedAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on NestedAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in NestedAggregation');
    }

    /**
     * Sets the nested path
     *
     * @param {string} path `path` of the nested document
     * @returns {NestedAggregation} returns `this` so that calls can be chained
     */
    path(path) {
        this._aggsDef.path = path;
        return this;
    }
}

module.exports = NestedAggregation;

},{"./bucket-aggregation-base":4,"lodash.isnil":183}],28:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-parent-aggregation.html';

/**
 * A special single bucket aggregation that enables aggregating
 * from buckets on child document types to buckets on parent documents.
 *
 * This aggregation relies on the `_parent` field in the mapping.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-parent-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.termsAggregation('top-names', 'owner.display_name.keyword')
 *             .size(10)
 *             .agg(
 *                 esb.parentAggregation('to-questions')
 *                     .type('answer')
 *                     .agg(
 *                         esb.termsAggregation(
 *                             'top-tags',
 *                             'tags.keyword'
 *                         ).size(10)
 *                     )
 *             )
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} type The type of the child document.
 *
 * @extends BucketAggregationBase
 */
class ParentAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, type) {
        super(name, 'parent');

        if (!isNil(type)) this.type(type);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on ParentAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in ParentAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on ParentAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in ParentAggregation');
    }

    /**
     * Sets the child type/mapping for aggregation.
     *
     * @param {string} type The child type that the buckets in the parent space should be mapped to.
     * @returns {ParentAggregation} returns `this` so that calls can be chained
     */
    type(type) {
        this._aggsDef.type = type;
        return this;
    }
}

module.exports = ParentAggregation;

},{"./bucket-aggregation-base":4,"lodash.isnil":183}],29:[function(require,module,exports){
'use strict';

const isEmpty = require('lodash.isempty');

const {
    util: { checkType }
} = require('../../core');

const BucketAggregationBase = require('./bucket-aggregation-base');

const hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * The `RangeAggregationBase` provides support for common options used across
 * various range `Aggregation` implementations like Range Aggregation and
 * Date Range aggregation.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string} aggType Type of aggregation
 * @param {string=} field The field to aggregate on
 *
 * @extends BucketAggregationBase
 */
class RangeAggregationBase extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, aggType, field) {
        super(name, aggType, field);
        // Variable name is misleading. Only one of these needs to be present.
        this._rangeRequiredKeys = ['from', 'to'];

        this._aggsDef.ranges = [];
    }

    /**
     * Sets the format expression for `key_as_string` in response buckets.
     * If no format is specified, then it will use the format specified in the field mapping.
     *
     * @param {string} fmt Supports expressive [date format pattern](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html#date-format-pattern) for Date Histograms
     * @returns {RangeAggregationBase} returns `this` so that calls can be chained
     */
    format(fmt) {
        this._aggsDef.format = fmt;
        return this;
    }

    /**
     * Adds a range to the list of existing range expressions.
     *
     * @param {Object} range Range to aggregate over. Valid keys are `from`, `to` and `key`
     * @returns {RangeAggregationBase} returns `this` so that calls can be chained
     *
     * @throws {TypeError} If `range` is not an instance of object
     * @throws {Error} If none of the required keys,
     * `from`, `to` or `mask`(for IP range) is passed
     */
    range(range) {
        checkType(range, Object);
        if (!this._rangeRequiredKeys.some(hasOwnProp, range)) {
            throw new Error(
                `Invalid Range! Range must have at least one of ${this._rangeRequiredKeys}`
            );
        }

        this._aggsDef.ranges.push(range);
        return this;
    }

    /**
     * Adds the list of ranges to the list of existing range expressions.
     *
     * @param {Array<Object>} ranges Ranges to aggregate over.
     * Each item must be an object with keys `from`, `to` and `key`.
     * @returns {RangeAggregationBase} returns `this` so that calls can be chained
     *
     * @throws {TypeError} If `ranges` is not an instance of an array or
     * and item in the array is not an instance of object
     * @throws {Error} If none of the required keys,
     * `from`, `to` or `mask`(for IP range) is passed
     */
    ranges(ranges) {
        checkType(ranges, Array);

        ranges.forEach(range => this.range(range));
        return this;
    }

    /**
     * Sets the missing parameter ehich defines how documents
     * that are missing a value should be treated.
     *
     * @param {string} value
     * @returns {RangeAggregationBase} returns `this` so that calls can be chained
     */
    missing(value) {
        this._aggsDef.missing = value;
        return this;
    }

    /**
     * Enable the response to be returned as a keyed object where the key is the
     * bucket interval.
     *
     * @example
     * const agg = esb.dateRangeAggregation('range', 'date')
     *     .format('MM-yyy')
     *     .ranges([{ to: 'now-10M/M' }, { from: 'now-10M/M' }])
     *     .keyed(true);
     *
     * @example
     * const agg = esb.geoDistanceAggregation('rings_around_amsterdam', 'location')
     *     .origin(esb.geoPoint().string('52.3760, 4.894'))
     *     .ranges([
     *         { to: 100000, key: 'first_ring' },
     *         { from: 100000, to: 300000, key: 'second_ring' },
     *         { from: 300000, key: 'third_ring' }
     *     ])
     *     .keyed(true);
     *
     * @param {boolean} keyed To enable keyed response or not.
     * @returns {RangeAggregationBase} returns `this` so that calls can be chained
     */
    keyed(keyed) {
        this._aggsDef.keyed = keyed;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for the `aggregation` query.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        if (isEmpty(this._aggsDef.ranges)) {
            throw new Error('`ranges` cannot be empty.');
        }

        return super.toJSON();
    }
}

module.exports = RangeAggregationBase;

},{"../../core":82,"./bucket-aggregation-base":4,"lodash.isempty":182}],30:[function(require,module,exports){
'use strict';

const RangeAggregationBase = require('./range-aggregation-base');

/**
 * A multi-bucket value source based aggregation that enables the user to
 * define a set of ranges - each representing a bucket. During the aggregation
 * process, the values extracted from each document will be checked against each
 * bucket range and "bucket" the relevant/matching document.
 *
 * Note that this aggregration includes the from value and excludes the to
 * value for each range.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-range-aggregation.html)
 *
 * @example
 * const agg = esb.rangeAggregation('price_ranges', 'price').ranges([
 *     { to: 50 },
 *     { from: 50, to: 100 },
 *     { from: 100 }
 * ]);
 *
 * @example
 * const agg = esb.rangeAggregation('price_ranges')
 *     .script(esb.script('inline', "doc['price'].value").lang('painless'))
 *     .ranges([{ to: 50 }, { from: 50, to: 100 }, { from: 100 }]);
 *
 * @example
 * // Value script for on-the-fly conversion before aggregation
 * const agg = esb.rangeAggregation('price_ranges', 'price')
 *     .script(
 *         esb.script('inline', '_value * params.conversion_rate')
 *             .lang('painless')
 *             .params({ conversion_rate: 0.8 })
 *     )
 *     .ranges([{ to: 50 }, { from: 50, to: 100 }, { from: 100 }]);
 *
 * @example
 * // Compute statistics over the prices in each price range
 * const agg = esb.rangeAggregation('price_ranges', 'price')
 *     .ranges([{ to: 50 }, { from: 50, to: 100 }, { from: 100 }])
 *     // Passing price to Stats Aggregation is optional(same value source)
 *     .agg(esb.statsAggregation('price_stats', 'price'));
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends RangeAggregationBase
 */
class RangeAggregation extends RangeAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'range', field);
    }
}

module.exports = RangeAggregation;

},{"./range-aggregation-base":29}],31:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-rare-terms-aggregation.html';

/**
 * A multi-bucket value source based aggregation which finds
 * "rare" terms — terms that are at the long-tail of the
 * distribution and are not frequent. Conceptually, this is like
 * a terms aggregation that is sorted by `_count` ascending.
 * As noted in the terms aggregation docs, actually ordering
 * a `terms` agg by count ascending has unbounded error.
 * Instead, you should use the `rare_terms` aggregation
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-rare-terms-aggregation.html)
 *
 * NOTE: Only available in Elasticsearch 7.3.0+.
 *
 * @example
 * const agg = esb.rareTermsAggregation('genres', 'genre');
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string} field The field we wish to find rare terms in
 *
 * @extends BucketAggregationBase
 */
class RareTermsAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'rare_terms', field);
    }

    /**
     * Sets the maximum number of documents a term should appear in.
     *
     * @example
     * const agg = esb.rareTermsAggregation('genres', 'genre').maxDocCount(2);
     *
     * @param {number} maxDocCnt Integer value for maximum number of documents a term should appear in.
     * Max doc count can be between 1 and 100.
     * @returns {RareTermsAggregation} returns `this` so that calls can be chained
     */
    maxDocCount(maxDocCnt) {
        if (isNil(maxDocCnt) || maxDocCnt < 1 || maxDocCnt > 100) {
            throw new Error('`maxDocCount` can only be value from 1 to 100.');
        }

        this._aggsDef.max_doc_count = maxDocCnt;
        return this;
    }

    /**
     * Sets the precision of the internal CuckooFilters. Smaller precision
     * leads to better approximation, but higher memory usage.
     * Cannot be smaller than 0.00001
     *
     * @example
     * const agg = esb.rareTermsAggregation('genres', 'genre').precision(0.001);
     *
     * @param {number} precision Float value for precision of the internal CuckooFilters. Default is 0.01
     * @returns {RareTermsAggregation} returns `this` so that calls can be chained
     */
    precision(precision) {
        if (precision < 0.00001) {
            throw new Error('`precision` must be greater than 0.00001.');
        }

        this._aggsDef.precision = precision;
        return this;
    }

    /**
     * Sets terms that should be included in the aggregation
     *
     * @example
     * const agg = esb.rareTermsAggregation('genres', 'genre').include('swi*');
     *
     * @param {string} include Regular expression that will determine what values
     * are "allowed" to be aggregated
     * @returns {RareTermsAggregation} returns `this` so that calls can be chained
     */
    include(include) {
        this._aggsDef.include = include;
        return this;
    }

    /**
     * Sets terms that should be excluded from the aggregation
     *
     * @example
     * const agg = esb.rareTermsAggregation('genres', 'genre').exclude('electro*');
     *
     * @param {string} exclude Regular expression that will determine what values
     * should not be aggregated
     * @returns {RareTermsAggregation} returns `this` so that calls can be chained
     */
    exclude(exclude) {
        this._aggsDef.exclude = exclude;
        return this;
    }

    /**
     * Sets the missing parameter which defines how documents
     * that are missing a value should be treated.
     *
     * @param {string} value
     * @returns {RareTermsAggregation} returns `this` so that calls can be chained
     */
    missing(value) {
        this._aggsDef.missing = value;
        return this;
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on RareTermsAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in RareTermsAggregation');
    }
}

module.exports = RareTermsAggregation;

},{"./bucket-aggregation-base":4,"lodash.isnil":183}],32:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-reverse-nested-aggregation.html';

/**
 * A special single bucket aggregation that enables aggregating
 * on parent docs from nested documents. Effectively this
 * aggregation can break out of the nested block structure and
 * link to other nested structures or the root document,
 * which allows nesting other aggregations that aren’t part of
 * the nested object in a nested aggregation.
 *
 * The `reverse_nested` aggregation must be defined inside a nested aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-reverse-nested-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.matchQuery('name', 'led tv'))
 *     .agg(
 *         esb.nestedAggregation('comments', 'comments').agg(
 *             esb.termsAggregation('top_usernames', 'comments.username').agg(
 *                 esb.reverseNestedAggregation('comment_to_issue').agg(
 *                     esb.termsAggregation('top_tags_per_comment', 'tags')
 *                 )
 *             )
 *         )
 *     );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} path Defines to what nested object field should be joined back.
 * The default is empty, which means that it joins back to the root / main document
 * level.
 *
 * @extends BucketAggregationBase
 */
class ReverseNestedAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, path) {
        super(name, 'reverse_nested');

        if (!isNil(path)) this._aggsDef.path = path;
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on ReverseNestedAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in ReverseNestedAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on ReverseNestedAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in ReverseNestedAggregation');
    }

    /**
     * Sets the level to join back for subsequent aggregations in a multiple
     * layered nested object types
     *
     * @param {string} path Defines to what nested object field should be joined back.
     * The default is empty, which means that it joins back to the root / main document
     * level.
     * @returns {ReverseNestedAggregation} returns `this` so that calls can be chained
     */
    path(path) {
        this._aggsDef.path = path;
        return this;
    }
}

module.exports = ReverseNestedAggregation;

},{"./bucket-aggregation-base":4,"lodash.isnil":183}],33:[function(require,module,exports){
'use strict';

const BucketAggregationBase = require('./bucket-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-sampler-aggregation.html';

/**
 * A filtering aggregation used to limit any sub aggregations'
 * processing to a sample of the top-scoring documents.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-sampler-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.queryStringQuery('tags:kibana OR tags:javascript'))
 *     .agg(
 *         esb.samplerAggregation('sample')
 *             .shardSize(200)
 *             .agg(
 *                 esb.significantTermsAggregation(
 *                     'keywords',
 *                     'tags'
 *                 ).exclude(['kibana', 'javascript'])
 *             )
 *     );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends BucketAggregationBase
 */
class SamplerAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name) {
        super(name, 'sampler');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on SamplerAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in SamplerAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on SamplerAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in SamplerAggregation');
    }

    /**
     * The shard_size parameter limits how many top-scoring documents
     * are collected in the sample processed on each shard. The default value is 100.
     *
     * @param {number} size Maximum number of documents to return from each shard(Integer)
     * @returns {SamplerAggregation} returns `this` so that calls can be chained
     */
    shardSize(size) {
        this._aggsDef.shard_size = size;
        return this;
    }
}

module.exports = SamplerAggregation;

},{"./bucket-aggregation-base":4}],34:[function(require,module,exports){
'use strict';

const {
    Query,
    Script,
    util: { checkType }
} = require('../../core');

const TermsAggregationBase = require('./terms-aggregation-base');

/**
 * The `SignificantAggregationBase` provides support for common options used
 * in `SignificantTermsAggregation` and `SignificantTextAggregation`.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @extends TermsAggregationBase
 */
class SignificantAggregationBase extends TermsAggregationBase {
    /**
     * Use JLH score as significance score.
     *
     * @returns {SignificantAggregationBase} returns `this` so that calls can be chained
     */
    jlh() {
        // I am guessing here
        // Reference is not clear on usage
        this._aggsDef.jlh = {};
        return this;
    }

    /**
     * Use `mutual_information` as significance score
     *
     * @param {boolean=} includeNegatives Default `true`. If set to `false`,
     * filters out the terms that appear less often in the subset than in
     * documents outside the subset
     * @param {boolean=} backgroundIsSuperset `true`(default) if the documents in the bucket
     * are also contained in the background. If instead you defined a custom background filter
     * that represents a different set of documents that you want to compare to, pass `false`
     * @returns {SignificantAggregationBase} returns `this` so that calls can be chained
     */
    mutualInformation(includeNegatives = true, backgroundIsSuperset = true) {
        this._aggsDef.mutual_information = {
            include_negatives: includeNegatives,
            background_is_superset: backgroundIsSuperset
        };
        return this;
    }

    /**
     * Use `chi_square` as significance score
     *
     * @param {boolean} includeNegatives Default `true`. If set to `false`,
     * filters out the terms that appear less often in the subset than in
     * documents outside the subset
     * @param {boolean} backgroundIsSuperset `true`(default) if the documents in the bucket
     * are also contained in the background. If instead you defined a custom background filter
     * that represents a different set of documents that you want to compare to, pass `false`
     * @returns {SignificantAggregationBase} returns `this` so that calls can be chained
     */
    chiSquare(includeNegatives = true, backgroundIsSuperset = true) {
        this._aggsDef.chi_square = {
            include_negatives: includeNegatives,
            background_is_superset: backgroundIsSuperset
        };
        return this;
    }

    /**
     * Sets `gnd`, google normalized score to be used as significance score.
     *
     * @param {boolean} backgroundIsSuperset `true`(default) if the documents in the bucket
     * are also contained in the background. If instead you defined a custom background filter
     * that represents a different set of documents that you want to compare to, pass `false`
     * @returns {SignificantAggregationBase} returns `this` so that calls can be chained
     */
    gnd(backgroundIsSuperset = true) {
        this._aggsDef.gnd = {
            background_is_superset: backgroundIsSuperset
        };
        return this;
    }

    /**
     * Use a simple calculation of the number of documents in the foreground sample with a term
     * divided by the number of documents in the background with the term. By default this
     * produces a score greater than zero and less than one.
     *
     * @returns {SignificantAggregationBase} returns `this` so that calls can be chained
     */
    percentage() {
        this._aggsDef.percentage = {};
        return this;
    }

    /**
     * Sets script for customized score calculation.
     *
     * @param {Script} script
     * @returns {SignificantAggregationBase} returns `this` so that calls can be chained
     */
    scriptHeuristic(script) {
        checkType(script, Script);

        this._aggsDef.script_heuristic = { script };
        return this;
    }

    /**
     * Sets the `background_filter` to narrow the scope of statistical information
     * for background term frequencies instead of using the entire index.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchQuery('text', 'madrid'))
     *     .agg(
     *         esb.significantAggregationBase('tags', 'tag').backgroundFilter(
     *             esb.termQuery('text', 'spain')
     *         )
     *     );
     *
     * @param {Query} filterQuery Filter query
     * @returns {SignificantAggregationBase} returns `this` so that calls can be chained
     */
    backgroundFilter(filterQuery) {
        checkType(filterQuery, Query);

        this._aggsDef.background_filter = filterQuery;
        return this;
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on SignificantAggregationBase
     */
    script() {
        console.log(`Please refer ${this._refUrl}`);
        throw new Error(`script is not supported in ${this.constructor.name}`);
    }
}

module.exports = SignificantAggregationBase;

},{"../../core":82,"./terms-aggregation-base":37}],35:[function(require,module,exports){
'use strict';

const SignificantAggregationBase = require('./significant-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-significantterms-aggregation.html';

/**
 * An aggregation that returns interesting or unusual occurrences of terms in
 * a set.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-significantterms-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.termsQuery('force', 'British Transport Police'))
 *     .agg(
 *         esb.significantTermsAggregation(
 *             'significantCrimeTypes',
 *             'crime_type'
 *         )
 *     );
 *
 * @example
 * // Use parent aggregation for segregated data analysis
 * const agg = esb.termsAggregation('forces', 'force').agg(
 *     esb.significantTermsAggregation('significantCrimeTypes', 'crime_type')
 * );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends SignificantAggregationBase
 */
class SignificantTermsAggregation extends SignificantAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'significant_terms', ES_REF_URL, field);
    }
}

module.exports = SignificantTermsAggregation;

},{"./significant-aggregation-base":34}],36:[function(require,module,exports){
'use strict';

const {
    util: { checkType }
} = require('../../core');

const SignificantAggregationBase = require('./significant-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-significanttext-aggregation.html';

/**
 * An aggregation that returns interesting or unusual occurrences of free-text
 * terms in a set. It is like the `SignificantTermsAggregation` but differs in
 * that:
 *   - It is specifically designed for use on type `text` fields
 *   - It does not require field data or doc-values
 *   - It re-analyzes text content on-the-fly meaning it can also filter
 *     duplicate sections of noisy text that otherwise tend to skew statistics.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-significanttext-aggregation.html)
 *
 * NOTE: This query was added in elasticsearch v6.0.
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *   .query(esb.matchQuery('content', 'Bird flu'))
 *   .agg(
 *     esb.samplerAggregation('my_sample')
 *       .shardSize(100)
 *       .agg(esb.significantTextAggregation('keywords', 'content'))
 *   );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends SignificantAggregationBase
 */
class SignificantTextAggregation extends SignificantAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'significant_text', ES_REF_URL, field);
    }

    /**
     * Control if duplicate paragraphs of text should try be filtered from the
     * statistical text analysis. Can improve results but slows down analysis.
     * Default is `false`.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *   .query(esb.matchQuery('content', 'elasticsearch'))
     *   .agg(
     *     esb.samplerAggregation('sample')
     *       .shardSize(100)
     *       .agg(
     *         esb.significantTextAggregation('keywords', 'content')
     *           .filterDuplicateText(true)
     *       )
     *   );
     *
     * @param {boolean} enable
     * @returns {SignificantTextAggregation} returns `this` so that calls can be chained
     */
    filterDuplicateText(enable) {
        this._aggsDef.filter_duplicate_text = enable;
        return this;
    }

    /**
     * Selects the fields to load from `_source` JSON and analyze. If none are
     * specified, the indexed "fieldName" value is assumed to also be the name
     * of the JSON field holding the value
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *   .query(esb.matchQuery('custom_all', 'elasticsearch'))
     *   .agg(
     *     esb.significantTextAggregation('tags', 'custom_all')
     *       .sourceFields(['content', 'title'])
     *   );
     *
     * @param {Array<string>} srcFields Array of fields
     * @returns {SignificantTextAggregation} returns `this` so that calls can be chained
     */
    sourceFields(srcFields) {
        checkType(srcFields, Array);

        this._aggsDef.source_fields = srcFields;
        return this;
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on SignificantTextAggregation
     */
    missing() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error(
            'missing is not supported in SignificantTextAggregation'
        );
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on SignificantTextAggregation
     */
    executionHint() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error(
            'executionHint is not supported in SignificantTextAggregation'
        );
    }
}

module.exports = SignificantTextAggregation;

},{"../../core":82,"./significant-aggregation-base":34}],37:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { invalidParam },
    consts: { EXECUTION_HINT_SET }
} = require('../../core');

const BucketAggregationBase = require('./bucket-aggregation-base');

const invalidExecutionHintParam = invalidParam(
    '',
    'execution_hint',
    EXECUTION_HINT_SET
);

/**
 * The `TermsAggregationBase` provides support for common options used across
 * various terms `Aggregation` implementations like Significant terms and
 * Terms aggregation.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string} aggType Type of aggregation
 * @param {string} refUrl Elasticsearch reference URL.
 * @param {string=} field The field to aggregate on
 *
 * @extends BucketAggregationBase
 */
class TermsAggregationBase extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, aggType, refUrl, field) {
        super(name, aggType, field);

        this._refUrl = refUrl;
    }

    /**
     * Sets the format expression for `key_as_string` in response buckets.
     * If no format is specified, then it will use the first format specified in the field mapping.
     *
     * @param {string} fmt Format mask to apply on aggregation response. Example: ####.00.
     * @returns {TermsAggregationBase} returns `this` so that calls can be chained
     */
    format(fmt) {
        this._aggsDef.format = fmt;
        return this;
    }

    /**
     * Sets the minimum number of matching hits required to return the terms.
     *
     * @example
     * const agg = esb.significantTermsAggregation('tags', 'tag').minDocCount(10);
     *
     * @param {number} minDocCnt Integer value for minimum number of documents
     * required to return bucket in response
     * @returns {TermsAggregationBase} returns `this` so that calls can be chained
     */
    minDocCount(minDocCnt) {
        this._aggsDef.min_doc_count = minDocCnt;
        return this;
    }

    /**
     * Sets the parameter which regulates the _certainty_ a shard has if the term
     * should actually be added to the candidate list or not with respect to
     * the `min_doc_count`.
     * Terms will only be considered if their local shard frequency within
     * the set is higher than the `shard_min_doc_count`.
     *
     * @param {number} minDocCnt Sets the `shard_min_doc_count` parameter. Default is 1
     * and has no effect unless you explicitly set it.
     * @returns {TermsAggregationBase} returns `this` so that calls can be chained
     */
    shardMinDocCount(minDocCnt) {
        this._aggsDef.shard_min_doc_count = minDocCnt;
        return this;
    }

    /**
     * Defines how many term buckets should be returned out of the overall terms list.
     *
     * @example
     * const agg = esb.termsAggregation('products', 'product').size(5);
     *
     * @param {number} size
     * @returns {TermsAggregationBase} returns `this` so that calls can be chained
     */
    size(size) {
        this._aggsDef.size = size;
        return this;
    }

    /**
     * Sets the `shard_size` parameter to control the volumes of candidate terms
     * produced by each shard. For the default, -1, shard_size will be automatically
     * estimated based on the number of shards and the size parameter.
     *
     * `shard_size` cannot be smaller than size (as it doesn’t make much sense).
     * When it is, elasticsearch will override it and reset it to be equal to size.
     *
     * @param {number} size
     * @returns {TermsAggregationBase} returns `this` so that calls can be chained
     */
    shardSize(size) {
        this._aggsDef.shard_size = size;
        return this;
    }

    /**
     * Sets the missing parameter which defines how documents
     * that are missing a value should be treated.
     *
     * @param {string} value
     * @returns {TermsAggregationBase} returns `this` so that calls can be chained
     */
    missing(value) {
        this._aggsDef.missing = value;
        return this;
    }

    /**
     * Filter the values for which buckets will be created.
     *
     * @example
     * const agg = esb.termsAggregation('tags', 'tags')
     *     .include('.*sport.*')
     *     .exclude('water_.*');
     *
     * @example
     * // Match on exact values
     * const reqBody = esb.requestBodySearch()
     *     .agg(
     *         esb.termsAggregation('JapaneseCars', 'make').include([
     *             'mazda',
     *             'honda'
     *         ])
     *     )
     *     .agg(
     *         esb.termsAggregation('ActiveCarManufacturers', 'make').exclude([
     *             'rover',
     *             'jensen'
     *         ])
     *     );
     *
     * @param {RegExp|Array|string} clause Determine what values are "allowed" to be aggregated
     * @returns {TermsAggregationBase} returns `this` so that calls can be chained
     */
    include(clause) {
        this._aggsDef.include = clause;
        return this;
    }

    /**
     * Filter the values for which buckets will be created.
     *
     * @example
     * const agg = esb.termsAggregation('tags', 'tags')
     *     .include('.*sport.*')
     *     .exclude('water_.*');
     *
     * @example
     * // Match on exact values
     * const reqBody = esb.requestBodySearch()
     *     .agg(
     *         esb.termsAggregation('JapaneseCars', 'make').include([
     *             'mazda',
     *             'honda'
     *         ])
     *     )
     *     .agg(
     *         esb.termsAggregation('ActiveCarManufacturers', 'make').exclude([
     *             'rover',
     *             'jensen'
     *         ])
     *     );
     *
     * @param {RegExp|Array|string} clause Determine the values that should not be aggregated
     * @returns {TermsAggregationBase} returns `this` so that calls can be chained
     */
    exclude(clause) {
        this._aggsDef.exclude = clause;
        return this;
    }

    /**
     * This setting can influence the management of the values used
     * for de-duplication. Each option will hold up to shard_size
     * values in memory while performing de-duplication but
     * the type of value held can be controlled
     *
     * @example
     * const agg = esb.significantTermsAggregation('tags', 'tag').executionHint('map');
     *
     * @example
     * const agg = esb.termsAggregation('tags', 'tags').executionHint('map');
     *
     * @param {string} hint the possible values are `map`, `global_ordinals`,
     * `global_ordinals_hash` and `global_ordinals_low_cardinality`
     * @returns {TermsAggregationBase} returns `this` so that calls can be chained
     * @throws {Error} If Execution Hint is outside the accepted set.
     */
    executionHint(hint) {
        if (isNil(hint)) invalidExecutionHintParam(hint, this._refUrl);

        const hintLower = hint.toLowerCase();
        if (!EXECUTION_HINT_SET.has(hintLower)) {
            invalidExecutionHintParam(hint, this._refUrl);
        }

        this._aggsDef.execution_hint = hint;
        return this;
    }
}

module.exports = TermsAggregationBase;

},{"../../core":82,"./bucket-aggregation-base":4,"lodash.isnil":183}],38:[function(require,module,exports){
'use strict';

const has = require('lodash.has');
const isNil = require('lodash.isnil');

const {
    util: { invalidParam }
} = require('../../core');

const TermsAggregationBase = require('./terms-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html';

const invalidDirectionParam = invalidParam(
    ES_REF_URL,
    'direction',
    "'asc' or 'desc'"
);
const invalidCollectModeParam = invalidParam(
    ES_REF_URL,
    'mode',
    "'breadth_first' or 'depth_first'"
);

/**
 * A multi-bucket value source based aggregation where buckets are dynamically
 * built - one per unique value.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html)
 *
 * @example
 * const agg = esb.termsAggregation('genres', 'genre');
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends TermsAggregationBase
 */
class TermsAggregation extends TermsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'terms', ES_REF_URL, field);
    }

    /**
     * When set to `true`, shows an error value for each term returned by the aggregation
     * which represents the _worst case error_ in the document count and can be useful
     * when deciding on a value for the shard_size parameter.
     *
     * @param {boolean} enable
     * @returns {TermsAggregation} returns `this` so that calls can be chained
     */
    showTermDocCountError(enable) {
        this._aggsDef.show_term_doc_count_error = enable;
        return this;
    }

    /**
     * Break the analysis up into multiple requests by grouping the field’s values
     * into a number of partitions at query-time and processing only one
     * partition in each request.
     *
     * Note that this method is a special case as the name doesn't map to the
     * elasticsearch parameter name. This is required because there is already
     * a method for `include` applicable for Terms aggregations. However, this
     * could change depending on community interest.
     *
     * @example
     * const agg = esb.termsAggregation('expired_sessions', 'account_id')
     *     .includePartition(0, 20)
     *     .size(10000)
     *     .order('last_access', 'asc')
     *     .agg(esb.maxAggregation('last_access', 'access_date'));
     *
     * @param {number} partition
     * @param {number} numPartitions
     * @returns {TermsAggregation} returns `this` so that calls can be chained
     */
    includePartition(partition, numPartitions) {
        // TODO: Print warning if include key is being overwritten
        this._aggsDef.include = {
            partition,
            num_partitions: numPartitions
        };
        return this;
    }

    /**
     * Can be used for deferring calculation of child aggregations by using
     * `breadth_first` mode. In `depth_first` mode all branches of the aggregation
     * tree are expanded in one depth-first pass and only then any pruning occurs.
     *
     * @example
     * const agg = esb.termsAggregation('actors', 'actors')
     *     .size(10)
     *     .collectMode('breadth_first')
     *     .agg(esb.termsAggregation('costars', 'actors').size(5));
     *
     * @param {string} mode The possible values are `breadth_first` and `depth_first`.
     * @returns {TermsAggregation} returns `this` so that calls can be chained
     */
    collectMode(mode) {
        if (isNil(mode)) invalidCollectModeParam(mode);

        const modeLower = mode.toLowerCase();
        if (modeLower !== 'breadth_first' && modeLower !== 'depth_first') {
            invalidCollectModeParam(mode);
        }

        this._aggsDef.collect_mode = modeLower;
        return this;
    }

    /**
     * Sets the ordering for buckets
     *
     * @example
     * // Ordering the buckets by their doc `_count` in an ascending manner
     * const agg = esb.termsAggregation('genres', 'genre').order('_count', 'asc');
     *
     * @example
     * // Ordering the buckets alphabetically by their terms in an ascending manner
     * const agg = esb.termsAggregation('genres', 'genre').order('_term', 'asc');
     *
     * @example
     * // Ordering the buckets by single value metrics sub-aggregation
     * // (identified by the aggregation name)
     * const agg = esb.termsAggregation('genres', 'genre')
     *     .order('max_play_count', 'asc')
     *     .agg(esb.maxAggregation('max_play_count', 'play_count'));
     *
     * @example
     * // Ordering the buckets by multi value metrics sub-aggregation
     * // (identified by the aggregation name):
     * const agg = esb.termsAggregation('genres', 'genre')
     *     .order('playback_stats.max', 'desc')
     *     .agg(esb.statsAggregation('playback_stats', 'play_count'));
     *
     * @example
     * // Multiple order criteria
     * const agg = esb.termsAggregation('countries')
     *     .field('artist.country')
     *     .order('rock>playback_stats.avg', 'desc')
     *     .order('_count', 'desc')
     *     .agg(
     *         esb.filterAggregation('rock')
     *             .filter(esb.termQuery('genre', 'rock'))
     *             .agg(esb.statsAggregation('playback_stats', 'play_count'))
     *     );
     *
     * @param {string} key
     * @param {string} direction `asc` or `desc`
     * @returns {TermsAggregation} returns `this` so that calls can be chained
     */
    order(key, direction = 'desc') {
        if (isNil(direction)) invalidDirectionParam(direction);

        const directionLower = direction.toLowerCase();
        if (directionLower !== 'asc' && directionLower !== 'desc') {
            invalidDirectionParam(direction);
        }

        if (has(this._aggsDef, 'order')) {
            if (!Array.isArray(this._aggsDef.order)) {
                this._aggsDef.order = [this._aggsDef.order];
            }

            this._aggsDef.order.push({ [key]: directionLower });
        } else {
            this._aggsDef.order = { [key]: directionLower };
        }

        return this;
    }
}

module.exports = TermsAggregation;

},{"../../core":82,"./terms-aggregation-base":37,"lodash.has":179,"lodash.isnil":183}],39:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const BucketAggregationBase = require('./bucket-aggregation-base');

/**
 * This is a multi-bucket aggregation similar to Histogram.
 * However, the width of each bucket is not specified.
 * Rather, a target number of buckets is provided and bucket intervals are dynamically determined based on the document distribution.
 * This is done using a simple one-pass document clustering algorithm that aims to obtain low distances between bucket centroids.
 * Unlike other multi-bucket aggregations, the intervals will not necessarily have a uniform width.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-variablewidthhistogram-aggregation.html)
 *
 * NOTE: Only available in Elasticsearch v7.9.0+
 * @example
 * const agg = esb.variableWidthHistogramAggregation('price', 'lowestPrice', 10)
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string} [field] The field to aggregate on
 * @param {number} [buckets] Bucket count to generate histogram over.
 *
 * @extends BucketAggregationBase
 */
class VariableWidthHistogramAggregation extends BucketAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field, buckets) {
        super(name, 'variable_width_histogram', field);
        if (!isNil(buckets)) this._aggsDef.buckets = buckets;
    }

    /**
     * Sets the histogram bucket count. Buckets are generated based on this value.
     *
     * @param {number} buckets Bucket count to generate histogram over.
     * @returns {VariableWidthHistogramAggregation} returns `this` so that calls can be chained
     */
    buckets(buckets) {
        this._aggsDef.buckets = buckets;
        return this;
    }
}

module.exports = VariableWidthHistogramAggregation;

},{"./bucket-aggregation-base":4,"lodash.isnil":183}],40:[function(require,module,exports){
'use strict';

// Not used in favor of explicit exports.
// IDE seems to handle those better

// const _ = require('lodash');

// const { util: { constructorWrapper } } = require('../core');

// const metricsAggs = require('./metrics-aggregations'),
//     bucketAggs = require('./bucket-aggregations');

// /* === Metrics Aggregations === */
// for (const clsName in metricsAggs) {
//     if (!has(metricsAggs, clsName)) continue;

//     exports[clsName] = metricsAggs[clsName];
//     exports[_.lowerFirst(clsName)] = constructorWrapper(metricsAggs[clsName]);
// }

// /* === Bucket Aggregations === */
// for (const clsName in bucketAggs) {
//     if (!has(bucketAggs, clsName)) continue;

//     exports[clsName] = bucketAggs[clsName];
//     exports[_.lowerFirst(clsName)] = constructorWrapper(bucketAggs[clsName]);
// }

exports.metricsAggregations = require('./metrics-aggregations');

exports.bucketAggregations = require('./bucket-aggregations');

exports.pipelineAggregations = require('./pipeline-aggregations');

exports.matrixAggregations = require('./matrix-aggregations');

},{"./bucket-aggregations":24,"./matrix-aggregations":41,"./metrics-aggregations":48,"./pipeline-aggregations":67}],41:[function(require,module,exports){
'use strict';

exports.MatrixStatsAggregation = require('./matrix-stats-aggregation');

},{"./matrix-stats-aggregation":42}],42:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Aggregation,
    util: { checkType }
} = require('../../core');

/**
 * The `matrix_stats` aggregation is a numeric aggregation that computes
 * statistics over a set of document fields
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-matrix-stats-aggregation.html)
 *
 * @example
 * const agg = esb.matrixStatsAggregation('matrixstats', ['poverty', 'income']);
 *
 * @param {string} name A valid aggregation name
 * @param {Array=} fields Array of fields
 *
 * @extends Aggregation
 */
class MatrixStatsAggregation extends Aggregation {
    // eslint-disable-next-line require-jsdoc
    constructor(name, fields) {
        super(name, 'matrix_stats');

        if (!isNil(fields)) this.fields(fields);
    }

    /**
     * The `fields` setting defines the set of fields (as an array) for computing
     * the statistics.
     *
     * @example
     * const agg = esb.matrixStatsAggregation('matrixstats')
     *     .fields(['poverty', 'income']);
     *
     * @param {Array<string>} fields Array of fields
     * @returns {MatrixStatsAggregation} returns `this` so that calls can be chained
     */
    fields(fields) {
        checkType(fields, Array);

        this._aggsDef.fields = fields;
        return this;
    }

    /**
     * The `mode` parameter controls what array value the aggregation will use for
     * array or multi-valued fields
     * @param {string} mode One of `avg`, `min`, `max`, `sum` and `median`
     * @returns {MatrixStatsAggregation} returns `this` so that calls can be chained
     */
    mode(mode) {
        // TODO: Add a set in consts and validate input
        this._aggsDef.mode = mode;
        return this;
    }

    /**
     * The missing parameter defines how documents that are missing a value should
     * be treated. By default they will be ignored but it is also possible to treat
     * them as if they had a value.
     *
     * @example
     * const agg = esb.matrixStatsAggregation('matrixstats')
     *     .fields(['poverty', 'income'])
     *     .missing({ income: 50000 });
     *
     * @param {Object} missing Set of fieldname : value mappings to specify default
     * values per field
     * @returns {MatrixStatsAggregation} returns `this` so that calls can be chained
     */
    missing(missing) {
        this._aggsDef.missing = missing;
        return this;
    }
}

module.exports = MatrixStatsAggregation;

},{"../../core":82,"lodash.isnil":183}],43:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base');

/**
 * A single-value metrics aggregation that computes the average of numeric
 * values that are extracted from the aggregated documents. These values can be
 * extracted either from specific numeric fields in the documents, or be
 * generated by a provided script.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-avg-aggregation.html)
 *
 * Aggregation that computes the average of numeric values that are extracted
 * from the aggregated documents.
 *
 * @example
 * // Compute the average grade over all documents
 * const agg = esb.avgAggregation('avg_grade', 'grade');
 *
 * @example
 * // Compute the average grade based on a script
 * const agg = esb.avgAggregation('avg_grade').script(
 *     esb.script('inline', "doc['grade'].value").lang('painless')
 * );
 *
 * @example
 * // Value script, apply grade correction
 * const agg = esb.avgAggregation('avg_grade', 'grade').script(
 *     esb.script('inline', '_value * params.correction')
 *         .lang('painless')
 *         .params({ correction: 1.2 })
 * );
 *
 * @example
 * // Missing value
 * const agg = esb.avgAggregation('avg_grade', 'grade').missing(10);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends MetricsAggregationBase
 */
class AvgAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'avg', field);
    }
}

module.exports = AvgAggregation;

},{"./metrics-aggregation-base":50}],44:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-cardinality-aggregation.html';

/**
 * A single-value metrics aggregation that calculates an approximate count of
 * distinct values. Values can be extracted either from specific fields in the
 * document or generated by a script.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-cardinality-aggregation.html)
 *
 * Aggregation that calculates an approximate count of distinct values.
 *
 * @example
 * const agg = esb.cardinalityAggregation('author_count', 'author');
 *
 * @example
 * const agg = esb.cardinalityAggregation('author_count').script(
 *     esb.script(
 *         'inline',
 *         "doc['author.first_name'].value + ' ' + doc['author.last_name'].value"
 *     ).lang('painless')
 * );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends MetricsAggregationBase
 */
class CardinalityAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'cardinality', field);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on CardinalityAggregation
     */
    format() {
        // Not 100% sure about this.
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in CardinalityAggregation');
    }

    /**
     * The `precision_threshold` options allows to trade memory for accuracy,
     * and defines a unique count below which counts are expected to be close to accurate.
     *
     * @example
     * const agg = esb.cardinalityAggregation(
     *     'author_count',
     *     'author_hash'
     * ).precisionThreshold(100);
     *
     * @param {number} threshold The threshold value.
     * The maximum supported value is 40000, thresholds above this number
     * will have the same effect as a threshold of 40000. The default values is 3000.
     * @returns {CardinalityAggregation} returns `this` so that calls can be chained
     */
    precisionThreshold(threshold) {
        // TODO: Use validation and warning here
        this._aggsDef.precision_threshold = threshold;
        return this;
    }
}

module.exports = CardinalityAggregation;

},{"./metrics-aggregation-base":50}],45:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base');

/**
 * A multi-value metrics aggregation that computes stats over numeric values
 * extracted from the aggregated documents. These values can be extracted either
 * from specific numeric fields in the documents, or be generated by a provided
 * script.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-extendedstats-aggregation.html)
 *
 * Aggregation that computes extra stats over numeric values extracted from
 * the aggregated documents.
 *
 * @example
 * const agg = esb.extendedStatsAggregation('grades_stats', 'grade');
 *
 * @example
 * // Compute the grade stats based on a script
 * const agg = esb.extendedStatsAggregation('grades_stats').script(
 *     esb.script('inline', "doc['grade'].value").lang('painless')
 * );
 *
 * @example
 * // Value script, apply grade correction
 * const agg = esb.extendedStatsAggregation('grades_stats', 'grade').script(
 *     esb.script('inline', '_value * params.correction')
 *         .lang('painless')
 *         .params({ correction: 1.2 })
 * );
 *
 * @example
 * // Missing value
 * const agg = esb.extendedStatsAggregation('grades_stats', 'grade').missing(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends MetricsAggregationBase
 */
class ExtendedStatsAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'extended_stats', field);
    }

    /**
     * Set sigma in the request for getting custom boundary.
     * sigma controls how many standard deviations +/- from the mean should be displayed
     *
     * @example
     * const agg = esb.extendedStatsAggregation('grades_stats', 'grade').sigma(3);
     *
     * @param {number} sigma sigma can be any non-negative double,
     * meaning you can request non-integer values such as 1.5.
     * A value of 0 is valid, but will simply return the average for both upper and lower bounds.
     * @returns {ExtendedStatsAggregation} returns `this` so that calls can be chained
     */
    sigma(sigma) {
        this._aggsDef.sigma = sigma;
        return this;
    }
}

module.exports = ExtendedStatsAggregation;

},{"./metrics-aggregation-base":50}],46:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-geobounds-aggregation.html';

/**
 * A metric aggregation that computes the bounding box
 * containing all geo_point values for a field.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-geobounds-aggregation.html)
 *
 * @example
 * const agg = esb.geoBoundsAggregation('viewport', 'location').wrapLongitude(true);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends MetricsAggregationBase
 */
class GeoBoundsAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'geo_bounds', field);
    }

    // TODO: Override missing and take only GeoPoint as parameter

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoBoundsAggregation
     */
    format() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in GeoBoundsAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoBoundsAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in GeoBoundsAggregation');
    }

    /**
     *
     * @param {boolean} allowOverlap Optional parameter which specifies whether
     * the bounding box should be allowed to overlap the international date line.
     * The default value is true
     * @returns {GeoBoundsAggregation} returns `this` so that calls can be chained
     */
    wrapLongitude(allowOverlap) {
        this._aggsDef.wrap_longitude = allowOverlap;
        return this;
    }
}

module.exports = GeoBoundsAggregation;

},{"./metrics-aggregation-base":50}],47:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-geocentroid-aggregation.html';

/**
 * A metric aggregation that computes the weighted centroid
 * from all coordinate values for a Geo-point datatype field.
 *
 * [Elasticsearchreference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-geocentroid-aggregation.html)
 *
 * @example
 * const agg = esb.geoCentroidAggregation('centroid', 'location');
 *
 * @example
 * // Combined as a sub-aggregation to other bucket aggregations
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.matchQuery('crime', 'burglary'))
 *     .agg(
 *         esb.termsAggregation('towns', 'town').agg(
 *             esb.geoCentroidAggregation('centroid', 'location')
 *         )
 *     );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on. field must be a Geo-point datatype type
 *
 * @extends MetricsAggregationBase
 */
class GeoCentroidAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'geo_centroid', field);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoCentroidAggregation
     */
    format() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in GeoCentroidAggregation');
    }
}

module.exports = GeoCentroidAggregation;

},{"./metrics-aggregation-base":50}],48:[function(require,module,exports){
'use strict';

exports.MetricsAggregationBase = require('./metrics-aggregation-base');

exports.AvgAggregation = require('./avg-aggregation');
exports.CardinalityAggregation = require('./cardinality-aggregation');
exports.ExtendedStatsAggregation = require('./extended-stats-aggregation');
exports.GeoBoundsAggregation = require('./geo-bounds-aggregation');
exports.GeoCentroidAggregation = require('./geo-centroid-aggregation');
exports.MaxAggregation = require('./max-aggregation');
exports.MinAggregation = require('./min-aggregation');
exports.PercentilesAggregation = require('./percentiles-aggregation');
exports.PercentileRanksAggregation = require('./percentile-ranks-aggregation');
exports.ScriptedMetricAggregation = require('./scripted-metric-aggregation');
exports.StatsAggregation = require('./stats-aggregation');
exports.SumAggregation = require('./sum-aggregation');
exports.TopHitsAggregation = require('./top-hits-aggregation');
exports.ValueCountAggregation = require('./value-count-aggregation');
exports.WeightedAverageAggregation = require('./weighted-average-aggregation');

},{"./avg-aggregation":43,"./cardinality-aggregation":44,"./extended-stats-aggregation":45,"./geo-bounds-aggregation":46,"./geo-centroid-aggregation":47,"./max-aggregation":49,"./metrics-aggregation-base":50,"./min-aggregation":51,"./percentile-ranks-aggregation":52,"./percentiles-aggregation":53,"./scripted-metric-aggregation":54,"./stats-aggregation":55,"./sum-aggregation":56,"./top-hits-aggregation":57,"./value-count-aggregation":58,"./weighted-average-aggregation":59}],49:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base');

/**
 * A single-value metrics aggregation that keeps track and returns the
 * maximum value among the numeric values extracted from the aggregated
 * documents. These values can be extracted either from specific numeric fields
 * in the documents, or be generated by a provided script.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-max-aggregation.html)
 *
 * Aggregation that keeps track and returns the maximum value among the
 * numeric values extracted from the aggregated documents.
 *
 * @example
 * const agg = esb.maxAggregation('max_price', 'price');
 *
 * @example
 * // Use a file script
 * const agg = esb.maxAggregation('max_price').script(
 *     esb.script('file', 'my_script').params({ field: 'price' })
 * );
 *
 * @example
 * // Value script to apply the conversion rate to every value
 * // before it is aggregated
 * const agg = esb.maxAggregation('max_price').script(
 *     esb.script('inline', '_value * params.conversion_rate').params({
 *         conversion_rate: 1.2
 *     })
 * );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends MetricsAggregationBase
 */
class MaxAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'max', field);
    }
}

module.exports = MaxAggregation;

},{"./metrics-aggregation-base":50}],50:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Aggregation,
    Script,
    util: { checkType }
} = require('../../core');

/**
 * The `MetricsAggregationBase` provides support for common options used across
 * various metrics `Aggregation` implementations.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} name a valid aggregation name
 * @param {string} aggType type of aggregation
 * @param {string=} field The field to aggregate on
 *
 * @extends Aggregation
 */
class MetricsAggregationBase extends Aggregation {
    // eslint-disable-next-line require-jsdoc
    constructor(name, aggType, field) {
        super(name, aggType);

        if (!isNil(field)) this._aggsDef.field = field;
    }

    // TODO: Investigate whether Metrics Aggregations can have sub aggregations
    // Hide setters for `aggs` and `aggregations` if required

    // TODO: Investigate case when getters will be required

    /**
     * Sets field to run aggregation on.
     *
     * @param {string} field a valid field name
     * @returns {MetricsAggregationBase} returns `this` so that calls can be chained
     */
    field(field) {
        this._aggsDef.field = field;
        return this;
    }

    /**
     * Sets script parameter for aggregation.
     *
     * @example
     * // Compute the average grade based on a script
     * const agg = esb.avgAggregation('avg_grade').script(
     *     esb.script('inline', "doc['grade'].value").lang('painless')
     * );
     *
     * @example
     * // Value script, apply grade correction
     * const agg = esb.avgAggregation('avg_grade', 'grade').script(
     *     esb.script('inline', '_value * params.correction')
     *         .lang('painless')
     *         .params({ correction: 1.2 })
     * );
     *
     * @param {Script} script
     * @returns {MetricsAggregationBase} returns `this` so that calls can be chained
     * @throws {TypeError} If `script` is not an instance of `Script`
     */
    script(script) {
        checkType(script, Script);

        this._aggsDef.script = script;
        return this;
    }

    /**
     * Sets the missing parameter which defines how documents
     * that are missing a value should be treated.
     *
     * @example
     * const agg = esb.avgAggregation('avg_grade', 'grade').missing(10);
     *
     * @param {string} value
     * @returns {MetricsAggregationBase} returns `this` so that calls can be chained
     */
    missing(value) {
        this._aggsDef.missing = value;
        return this;
    }

    /**
     * Sets the format expression if applicable.
     *
     * @param {string} fmt Format mask to apply on aggregation response. Example: ####.00
     * @returns {MetricsAggregationBase} returns `this` so that calls can be chained
     */
    format(fmt) {
        this._aggsDef.format = fmt;
        return this;
    }
}

module.exports = MetricsAggregationBase;

},{"../../core":82,"lodash.isnil":183}],51:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base');

/**
 * A single-value metrics aggregation that keeps track and returns the
 * minimum value among the numeric values extracted from the aggregated
 * documents. These values can be extracted either from specific numeric fields
 * in the documents, or be generated by a provided script.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-min-aggregation.html)
 *
 * Aggregation that keeps track and returns the minimum value among numeric
 * values extracted from the aggregated documents.
 *
 * @example
 * const agg = esb.minAggregation('min_price', 'price');
 *
 * @example
 * // Use a file script
 * const agg = esb.minAggregation('min_price').script(
 *     esb.script('file', 'my_script').params({ field: 'price' })
 * );
 *
 * @example
 * // Value script to apply the conversion rate to every value
 * // before it is aggregated
 * const agg = esb.minAggregation('min_price').script(
 *     esb.script('inline', '_value * params.conversion_rate').params({
 *         conversion_rate: 1.2
 *     })
 * );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends MetricsAggregationBase
 */
class MinAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'min', field);
    }
}

module.exports = MinAggregation;

},{"./metrics-aggregation-base":50}],52:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { checkType }
} = require('../../core');

const MetricsAggregationBase = require('./metrics-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-percentile-rank-aggregation.html';

/**
 * A multi-value metrics aggregation that calculates one or more percentile ranks
 * over numeric values extracted from the aggregated documents. These values can
 * be extracted either from specific numeric fields in the documents, or be
 * generated by a provided script.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-percentile-rank-aggregation.html)
 *
 * Aggregation that calculates one or more percentiles ranks over numeric values
 * extracted from the aggregated documents.
 *
 * @example
 * const agg = esb.percentileRanksAggregation(
 *     'load_time_outlier',
 *     'load_time',
 *     [15, 30]
 * );
 *
 * @example
 * // Convert load time from mills to seconds on-the-fly using script
 * const agg = esb.percentileRanksAggregation('load_time_outlier')
 *     .values([3, 5])
 *     .script(
 *         esb.script('inline', "doc['load_time'].value / params.timeUnit")
 *             .lang('painless')
 *             .params({ timeUnit: 1000 })
 *     );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on. It must be a numeric field
 * @param {Array=} values Values to compute percentiles from.
 *
 * @throws {TypeError} If `values` is not an instance of Array
 *
 * @extends MetricsAggregationBase
 */
class PercentileRanksAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field, values) {
        super(name, 'percentile_ranks', field);

        if (!isNil(values)) this.values(values);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on PercentileRanksAggregation
     */
    format() {
        // Not 100% sure about this.
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error(
            'format is not supported in PercentileRanksAggregation'
        );
    }

    /**
     * Enable the response to be returned as a keyed object where the key is the
     * bucket interval.
     *
     * @example
     * // Return the ranges as an array rather than a hash
     * const agg = esb.percentileRanksAggregation('balance_outlier', 'balance')
     *     .values([25000, 50000])
     *     .keyed(false);
     *
     * @param {boolean} keyed To enable keyed response or not.
     * @returns {PercentilesRanksAggregation} returns `this` so that calls can be chained
     */
    keyed(keyed) {
        this._aggsDef.keyed = keyed;
        return this;
    }

    /**
     * Specifies the values to compute percentiles from.
     *
     * @param {Array<number>} values Values to compute percentiles from.
     * @returns {PercentileRanksAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `values` is not an instance of Array
     */
    values(values) {
        checkType(values, Array);
        this._aggsDef.values = values;
        return this;
    }

    /**
     * Compression controls memory usage and approximation error. The compression
     * value limits the maximum number of nodes to 100 * compression. By
     * increasing the compression value, you can increase the accuracy of your
     * percentiles at the cost of more memory. Larger compression values also make
     * the algorithm slower since the underlying tree data structure grows in
     * size, resulting in more expensive operations. The default compression
     * value is 100.
     *
     * @param {number} compression Parameter to balance memory utilization with estimation accuracy.
     * @returns {PercentileRanksAggregation} returns `this` so that calls can be chained
     */
    tdigest(compression) {
        this._aggsDef.tdigest = { compression };
        return this;
    }

    /**
     * Compression controls memory usage and approximation error. The compression
     * value limits the maximum number of nodes to 100 * compression. By
     * increasing the compression value, you can increase the accuracy of your
     * percentiles at the cost of more memory. Larger compression values also make
     * the algorithm slower since the underlying tree data structure grows in
     * size, resulting in more expensive operations. The default compression
     * value is 100.
     *
     * Alias for `tdigest`
     *
     * @param {number} compression Parameter to balance memory utilization with estimation accuracy.
     * @returns {PercentileRanksAggregation} returns `this` so that calls can be chained
     */
    compression(compression) {
        return this.tdigest(compression);
    }

    /**
     * HDR Histogram (High Dynamic Range Histogram) is an alternative implementation
     * that can be useful when calculating percentiles for latency measurements
     * as it can be faster than the t-digest implementation
     * with the trade-off of a larger memory footprint.
     *
     * The HDR Histogram can be used by specifying the method parameter in the request.
     *
     * @example
     * const agg = esb.percentileRanksAggregation(
     *     'load_time_outlier',
     *     'load_time',
     *     [15, 30]
     * ).hdr(3);
     *
     * @param {number} numberOfSigDigits The resolution of values
     * for the histogram in number of significant digits
     * @returns {PercentileRanksAggregation} returns `this` so that calls can be chained
     */
    hdr(numberOfSigDigits) {
        this._aggsDef.hdr = {
            number_of_significant_value_digits: numberOfSigDigits
        };
        return this;
    }
}

module.exports = PercentileRanksAggregation;

},{"../../core":82,"./metrics-aggregation-base":50,"lodash.isnil":183}],53:[function(require,module,exports){
'use strict';

const {
    util: { checkType }
} = require('../../core');

const MetricsAggregationBase = require('./metrics-aggregation-base');

/**
 * A multi-value metrics aggregation that calculates one or more percentiles
 * over numeric values extracted from the aggregated documents. These values can
 * be extracted either from specific numeric fields in the documents, or be
 * generated by a provided script.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-percentile-aggregation.html)
 *
 * Aggregation that calculates one or more percentiles over numeric values
 * extracted from the aggregated documents.
 *
 * @example
 * const agg = esb.percentilesAggregation('load_time_outlier', 'load_time');
 *
 * @example
 * // Convert load time from mills to seconds on-the-fly using script
 * const agg = esb.percentilesAggregation('load_time_outlier').script(
 *     esb.script('inline', "doc['load_time'].value / params.timeUnit")
 *         .lang('painless')
 *         .params({ timeUnit: 1000 })
 * );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends MetricsAggregationBase
 */
class PercentilesAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'percentiles', field);
    }

    /**
     * Enable the response to be returned as a keyed object where the key is the
     * bucket interval.
     *
     * @example
     * // Return the ranges as an array rather than a hash
     * const agg = esb.percentilesAggregation('balance_outlier', 'balance').keyed(
     *     false
     * );
     *
     * @param {boolean} keyed To enable keyed response or not. True by default
     * @returns {PercentilesAggregation} returns `this` so that calls can be chained
     */
    keyed(keyed) {
        this._aggsDef.keyed = keyed;
        return this;
    }

    /**
     * Specifies the percents of interest.
     * Requested percentiles must be a value between 0-100 inclusive
     *
     * @example
     * // Specify particular percentiles to calculate
     * const agg = esb.percentilesAggregation(
     *     'load_time_outlier',
     *     'load_time'
     * ).percents([95, 99, 99.9]);
     *
     * @param {Array<number>} percents Parameter to specify particular percentiles to calculate
     * @returns {PercentilesAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `percents` is not an instance of Array
     */
    percents(percents) {
        checkType(percents, Array);
        this._aggsDef.percents = percents;
        return this;
    }

    /**
     * Compression controls memory usage and approximation error. The compression
     * value limits the maximum number of nodes to 100 * compression. By
     * increasing the compression value, you can increase the accuracy of your
     * percentiles at the cost of more memory. Larger compression values also make
     * the algorithm slower since the underlying tree data structure grows in
     * size, resulting in more expensive operations. The default compression
     * value is 100.
     *
     * @example
     * const agg = esb.percentilesAggregation(
     *     'load_time_outlier',
     *     'load_time'
     * ).tdigest(200);
     *
     * @param {number} compression Parameter to balance memory utilization with estimation accuracy.
     * @returns {PercentilesAggregation} returns `this` so that calls can be chained
     */
    tdigest(compression) {
        this._aggsDef.tdigest = { compression };
        return this;
    }

    /**
     * Compression controls memory usage and approximation error. The compression
     * value limits the maximum number of nodes to 100 * compression. By
     * increasing the compression value, you can increase the accuracy of your
     * percentiles at the cost of more memory. Larger compression values also make
     * the algorithm slower since the underlying tree data structure grows in
     * size, resulting in more expensive operations. The default compression
     * value is 100.
     *
     * Alias for `tdigest`
     *
     * @example
     * const agg = esb.percentilesAggregation(
     *     'load_time_outlier',
     *     'load_time'
     * ).compression(200);
     *
     * @param {number} compression Parameter to balance memory utilization with estimation accuracy.
     * @returns {PercentilesAggregation} returns `this` so that calls can be chained
     */
    compression(compression) {
        this._aggsDef.tdigest = { compression };
        return this;
    }

    /**
     * HDR Histogram (High Dynamic Range Histogram) is an alternative implementation
     * that can be useful when calculating percentiles for latency measurements
     * as it can be faster than the t-digest implementation
     * with the trade-off of a larger memory footprint.
     *
     * The HDR Histogram can be used by specifying the method parameter in the request.
     *
     * @example
     * const agg = esb.percentilesAggregation('load_time_outlier', 'load_time')
     *     .percents([95, 99, 99.9])
     *     .hdr(3);
     *
     * @param {number} numberOfSigDigits The resolution of values
     * for the histogram in number of significant digits
     * @returns {PercentilesAggregation} returns `this` so that calls can be chained
     */
    hdr(numberOfSigDigits) {
        this._aggsDef.hdr = {
            number_of_significant_value_digits: numberOfSigDigits
        };
        return this;
    }
}

module.exports = PercentilesAggregation;

},{"../../core":82,"./metrics-aggregation-base":50}],54:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-scripted-metric-aggregation.html';

/**
 * A metric aggregation that executes using scripts to provide a metric output.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-scripted-metric-aggregation.html)
 *
 * Aggregation that keeps track and returns the minimum value among numeric
 * values extracted from the aggregated documents.
 *
 * @example
 * const agg = esb.scriptedMetricAggregation('profit')
 *     .initScript('params._agg.transactions = []')
 *     .mapScript(
 *         "params._agg.transactions.add(doc.type.value == 'sale' ? doc.amount.value : -1 * doc.amount.value)"
 *     )
 *     .combineScript(
 *         'double profit = 0; for (t in params._agg.transactions) { profit += t } return profit'
 *     )
 *     .reduceScript(
 *         'double profit = 0; for (a in params._aggs) { profit += a } return profit'
 *     );
 *
 * @example
 * // Specify using file scripts
 * const agg = esb.scriptedMetricAggregation('profit')
 *     .initScript(esb.script('file', 'my_init_script'))
 *     .mapScript(esb.script('file', 'my_map_script'))
 *     .combineScript(esb.script('file', 'my_combine_script'))
 *     // script parameters for `init`, `map` and `combine` scripts must be
 *     // specified in a global params object so that
 *     // it can be shared between the scripts
 *     .params({ field: 'amount', _agg: {} })
 *     .reduceScript(esb.script('file', 'my_reduce_script'));
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 *
 * @extends MetricsAggregationBase
 */
class ScriptedMetricAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name) {
        super(name, 'scripted_metric');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on ScriptedMetricAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in ScriptedMetricAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on ScriptedMetricAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in ScriptedMetricAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on ScriptedMetricAggregation
     */
    missing() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error(
            'missing is not supported in ScriptedMetricAggregation'
        );
    }

    /**
     * Sets the initialization script.
     *
     * Executed prior to any collection of documents. Allows the aggregation to set up any initial state.
     *
     * @param {string|Script} initScript The initialization script. Can be a string or an Script instance
     * @returns {ScriptedMetricAggregation} returns `this` so that calls can be chained
     */
    initScript(initScript) {
        this._aggsDef.init_script = initScript;
        return this;
    }

    /**
     * Sets the map script. This is the only required script.
     *
     * Executed once per document collected.
     * If no combine_script is specified, the resulting state needs to be stored in an object named _agg.
     *
     * @param {string|Script} mapScript The map script. Can be a string or an Script instance
     * @returns {ScriptedMetricAggregation} returns `this` so that calls can be chained
     */
    mapScript(mapScript) {
        this._aggsDef.map_script = mapScript;
        return this;
    }

    /**
     * Sets the combine phase script.
     *
     * Executed once on each shard after document collection is complete.
     * Allows the aggregation to consolidate the state returned from each shard.
     * If a combine_script is not provided the combine phase will return the aggregation variable.
     *
     * @param {string|Script} combineScript The combine script. Can be a string or an Script instance
     * @returns {ScriptedMetricAggregation} returns `this` so that calls can be chained
     */
    combineScript(combineScript) {
        this._aggsDef.combine_script = combineScript;
        return this;
    }

    /**
     * Sets the reduce phase script.
     *
     * Executed once on the coordinating node after all shards have returned their results.
     * The script is provided with access to a variable _aggs
     * which is an array of the result of the combine_script on each shard.
     * If a reduce_script is not provided the reduce phase will return the _aggs variable.
     *
     * @param {string|Script} reduceScript The combine script. Can be a string or an Script instance
     * @returns {ScriptedMetricAggregation} returns `this` so that calls can be chained
     */
    reduceScript(reduceScript) {
        this._aggsDef.reduce_script = reduceScript;
        return this;
    }

    /**
     * Sets the params for scripts.
     *
     * Optional object whose contents will be passed as variables to
     * the init_script, map_script and combine_script
     *
     * If you specify script parameters then you must specify `"_agg": {}`.
     *
     * @param {Object} params Object passed to init, map and combine script. Default value - `{ "_agg": {} }`
     * @returns {ScriptedMetricAggregation} returns `this` so that calls can be chained
     */
    params(params) {
        // TODO: If sure, add validation to see that _agg: {} is present in params
        this._aggsDef.params = params;
        return this;
    }
}

module.exports = ScriptedMetricAggregation;

},{"./metrics-aggregation-base":50}],55:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base');

/**
 * A multi-value metrics aggregation that computes stats over numeric values
 * extracted from the aggregated documents. These values can be extracted either
 * from specific numeric fields in the documents, or be generated by a provided
 * script.
 *
 * The stats that are returned consist of: min, max, sum, count and avg.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-stats-aggregation.html)
 *
 * Aggregation that computes stats over numeric values extracted from the
 * aggregated documents.
 *
 * @example
 * const agg = esb.statsAggregation('grades_stats', 'grade');
 *
 *
 * @example
 * // Use a file script
 * const agg = esb.statsAggregation('grades_stats').script(
 *     esb.script('file', 'my_script').params({ field: 'price' })
 * );
 *
 * @example
 * // Value script to apply the conversion rate to every value
 * // before it is aggregated
 * const agg = esb.statsAggregation('grades_stats').script(
 *     esb.script('inline', '_value * params.conversion_rate').params({
 *         conversion_rate: 1.2
 *     })
 * );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends MetricsAggregationBase
 */
class StatsAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'stats', field);
    }
}

module.exports = StatsAggregation;

},{"./metrics-aggregation-base":50}],56:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base');

/**
 * A single-value metrics aggregation that sums up numeric values that are
 * extracted from the aggregated documents. These values can be extracted either
 * from specific numeric fields in the documents, or be generated by a
 * provided script.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-stats-aggregation.html)
 *
 * Aggregation that sums up numeric values that are extracted from the
 * aggregated documents.
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.constantScoreQuery(esb.matchQuery('type', 'hat')))
 *     .agg(esb.sumAggregation('hat_prices', 'price'));
 *
 * @example
 * // Script to fetch the sales price
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.constantScoreQuery(esb.matchQuery('type', 'hat')))
 *     .agg(
 *         esb.sumAggregation('hat_prices').script(
 *             esb.script('inline', 'doc.price.value')
 *         )
 *     );
 *
 * @example
 * // Access the field value from the script using `_value`
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.constantScoreQuery(esb.matchQuery('type', 'hat')))
 *     .agg(
 *         esb.sumAggregation('square_hats', 'price').script(
 *             esb.script('inline', '_value * _value')
 *         )
 *     );
 *
 * @example
 * // Treat documents missing price as if they had a value
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.constantScoreQuery(esb.matchQuery('type', 'hat')))
 *     .agg(esb.sumAggregation('hat_prices', 'price').missing(100));
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends MetricsAggregationBase
 */
class SumAggregation extends MetricsAggregationBase {
    /**
     * Creates an instance of `SumAggregation`
     *
     * @param {string} name The name which will be used to refer to this aggregation.
     * @param {string=} field The field to aggregate on
     */
    constructor(name, field) {
        super(name, 'sum', field);
    }
}

module.exports = SumAggregation;

},{"./metrics-aggregation-base":50}],57:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base'),
    {
        Highlight,
        Sort,
        util: { checkType, setDefault }
    } = require('../../core');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-top-hits-aggregation.html';

/**
 * A `top_hits` metric aggregator keeps track of the most relevant document being
 * aggregated. This aggregator is intended to be used as a sub aggregator, so that
 * the top matching documents can be aggregated per bucket.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-top-hits-aggregation.html)
 *
 * `top_hits` metric aggregator keeps track of the most relevant document being
 * aggregated.
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.termsAggregation('top_tags', 'type')
 *             .size(3)
 *             .agg(
 *                 esb.topHitsAggregation('top_sales_hits')
 *                     .sort(esb.sort('date', 'desc'))
 *                     .source({ includes: ['date', 'price'] })
 *                     .size(1)
 *             )
 *     )
 *     .size(0);
 *
 * @example
 * // Field collapsing(logically groups a result set into
 * // groups and per group returns top documents)
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.matchQuery('body', 'elections'))
 *     .agg(
 *         esb.termsAggregation('top-sites', 'domain')
 *             .order('top_hit', 'desc')
 *             .agg(esb.topHitsAggregation('top_tags_hits'))
 *             .agg(
 *                 esb.maxAggregation('top_hit').script(
 *                     esb.script('inline', '_score')
 *                 )
 *             )
 *     );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 *
 * @extends MetricsAggregationBase
 */
class TopHitsAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name) {
        super(name, 'top_hits');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on TopHitsAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in TopHitsAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on TopHitsAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('script is not supported in TopHitsAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on TopHitsAggregation
     */
    missing() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('missing is not supported in TopHitsAggregation');
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on TopHitsAggregation
     */
    format() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in TopHitsAggregation');
    }

    /**
     * Sets the offset for fetching result.
     *
     * @param {number} from The offset from the first result you want to fetch.
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    from(from) {
        this._aggsDef.from = from;
        return this;
    }

    /**
     * Sets the maximum number of top matching hits to return per bucket.
     *
     * @param {number} size The numer of aggregation entries to be returned per bucket.
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    size(size) {
        this._aggsDef.size = size;
        return this;
    }

    /**
     * How the top matching hits should be sorted. Allows to add sort on specific field.
     * The sort can be reversed as well. The sort is defined on a per field level,
     * with special field name for `_score` to sort by score, and `_doc` to sort by
     * index order.
     *
     * @param {Sort} sort How the top matching hits should be sorted.
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained.
     * @throws {TypeError} If parameter `sort` is not an instance of `Sort`.
     */
    sort(sort) {
        checkType(sort, Sort);

        setDefault(this._aggsDef, 'sort', []);

        this._aggsDef.sort.push(sort);
        return this;
    }

    /**
     * Allows to add multiple sort on specific fields. Each sort can be reversed as well.
     * The sort is defined on a per field level, with special field name for _score to
     * sort by score, and _doc to sort by index order.
     *
     * @param {Array<Sort>} sorts Arry of sort How the top matching hits should be sorted.
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained.
     * @throws {TypeError} If any item in parameter `sorts` is not an instance of `Sort`.
     */
    sorts(sorts) {
        sorts.forEach(sort => this.sort(sort));
        return this;
    }

    /**
     * Enables score computation and tracking during sorting.
     * By default, sorting scores are not computed.
     *
     * @param {boolean} trackScores If scores should be computed and tracked. Defaults to false.
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    trackScores(trackScores) {
        this._aggsDef.track_scores = trackScores;
        return this;
    }

    /**
     * Enable/Disable returning version number for each hit.
     *
     * @param {boolean} version true to enable, false to disable
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    version(version) {
        this._aggsDef.version = version;
        return this;
    }

    /**
     * Enable/Disable explanation of score for each hit.
     *
     * @param {boolean} explain true to enable, false to disable
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    explain(explain) {
        this._aggsDef.explain = explain;
        return this;
    }

    /**
     * Performs highlighting based on the `Highlight` settings.
     *
     * @param {Highlight} highlight
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    highlight(highlight) {
        checkType(highlight, Highlight);

        this._aggsDef.highlight = highlight;
        return this;
    }

    /**
     * Allows to control how the `_source` field is returned with every hit.
     * You can turn off `_source` retrieval by passing `false`.
     * It also accepts one(string) or more wildcard(array) patterns to control
     * what parts of the `_source` should be returned
     * An object can also be used to specify the wildcard patterns for `includes` and `excludes`.
     *
     * @param {boolean|string|Array|Object} source
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    source(source) {
        this._aggsDef._source = source;
        return this;
    }

    /**
     * The stored_fields parameter is about fields that are explicitly marked as stored in the mapping.
     * Selectively load specific stored fields for each document represented by a search hit
     * using array of stored fields.
     * An empty array will cause only the _id and _type for each hit to be returned.
     * To disable the stored fields (and metadata fields) entirely use: '_none_'
     *
     * @param {Array|string} fields
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    storedFields(fields) {
        this._aggsDef.stored_fields = fields;
        return this;
    }

    /**
     * Computes a document property dynamically based on the supplied `Script`.
     *
     * @param {string} scriptFieldName
     * @param {string|Script} script string or instance of `Script`
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    scriptField(scriptFieldName, script) {
        setDefault(this._aggsDef, 'script_fields', {});

        this._aggsDef.script_fields[scriptFieldName] = { script };
        return this;
    }

    /**
     * Sets given dynamic document properties to be computed using supplied `Script`s.
     *
     * Object should have `scriptFieldName` as key and `script` as the value.
     *
     * @param {Object} scriptFields Object with `scriptFieldName` as key and `script` as the value.
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    scriptFields(scriptFields) {
        checkType(scriptFields, Object);

        Object.keys(scriptFields).forEach(scriptFieldName =>
            this.scriptField(scriptFieldName, scriptFields[scriptFieldName])
        );

        return this;
    }

    /**
     * Allows to return the doc value representation of a field for each hit.
     * Doc value fields can work on fields that are not stored.
     *
     * @param {Array<string>} fields
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    docvalueFields(fields) {
        this._aggsDef.docvalue_fields = fields;
        return this;
    }
}

module.exports = TopHitsAggregation;

},{"../../core":82,"./metrics-aggregation-base":50}],58:[function(require,module,exports){
'use strict';

const MetricsAggregationBase = require('./metrics-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-valuecount-aggregation.html';

/**
 * A single-value metrics aggregation that counts the number of values that
 * are extracted from the aggregated documents. These values can be extracted
 * either from specific fields in the documents, or be generated by a provided
 * script. Typically, this aggregator will be used in conjunction with other
 * single-value aggregations.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-valuecount-aggregation.html)
 *
 * Aggregation that counts the number of values that are extracted from the
 * aggregated documents.
 *
 * @example
 * const agg = esb.valueCountAggregation('types_count', 'type');
 *
 * @example
 * const agg = esb.valueCountAggregation('types_count').script(
 *     esb.script('inline', "doc['type'].value")
 * );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} field The field to aggregate on
 *
 * @extends MetricsAggregationBase
 */
class ValueCountAggregation extends MetricsAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super(name, 'value_count', field);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on ValueCountAggregation
     */
    format() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in ValueCountAggregation');
    }
}

module.exports = ValueCountAggregation;

},{"./metrics-aggregation-base":50}],59:[function(require,module,exports){
'use strict';

const { Script } = require('../../core');
const MetricsAggregationBase = require('./metrics-aggregation-base');
const isNil = require('lodash.isnil');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-weight-avg-aggregation.html';

/**
 * A single-value metrics aggregation that computes the weighted average of numeric values that are extracted from the aggregated documents.
 * These values can be extracted either from specific numeric fields in the documents.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-weight-avg-aggregation.html)
 *
 * Added in Elasticsearch v6.4.0
 * [Release notes](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/release-notes-6.4.0.html)
 *
 * As a formula, a weighted average is ∑(value * weight) / ∑(weight)
 *
 * @example
 * // Compute the average grade over all documents, weighing by teacher score.
 * const agg = esb.weightedAverageAggregation('avg_grade', 'grade', 'teacher_score');
 *
 * @example
 * // Compute the average grade where the weight is calculated by a script.
 * // Filling in missing values as '10'.
 * const agg = esb.weightedAverageAggregation('avg_grade', 'grade')
 *      .weight(esb.script('inline', "doc['teacher_score'].value").lang('painless'), 10)
 * );
 *
 * @example
 * // Compute the average grade, weighted by teacher score, filling in missing values.
 * const agg = esb.weightedAverageAggregation('avg_grade').value('grade', 5).weight('teacher_score', 10));
 *
 * @example
 * // Compute the average grade over all documents, weighing by teacher score.
 * const agg = esb.weightedAverageAggregation('avg_grade').value('grade').weight('teacher_score');
 *
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} value The field or script to use as the value
 * @param {string=} weight The field or script to use as the weight
 *
 * @extends MetricsAggregationBase
 */
class WeightedAverageAggregation extends MetricsAggregationBase {
    /**
     * Creates an instance of `WeightedAverageAggregation`
     *
     * @param {string} name The name which will be used to refer to this aggregation.
     * @param {string=} value The field or script to be used as the value.
     * @param {string=} weight The field or script to be used as the weighting.
     */
    constructor(name, value, weight) {
        super(name, 'weighted_avg');

        this._aggsDef.value = {};
        this._aggsDef.weight = {};

        if (!isNil(value)) {
            this.value(value);
        }

        if (!isNil(weight)) {
            this.weight(weight);
        }
    }

    /**
     * Sets the value
     *
     * @param {string | Script} value Field name or script to use as the value.
     *
     * @param {number=} missing Sets the missing parameter which defines how documents
     * that are missing a value should be treated.
     * @returns {WeightedAverageAggregation} returns `this` so that calls can be chained
     */
    value(value, missing) {
        if (typeof value !== 'string' && !(value instanceof Script)) {
            throw new TypeError(
                'Value must be either a string or instanceof Script'
            );
        }

        if (value instanceof Script) {
            if (this._aggsDef.value.field) {
                delete this._aggsDef.value.field;
            }
            this._aggsDef.value.script = value;
        } else {
            if (this._aggsDef.value.script) {
                delete this._aggsDef.value.script;
            }
            this._aggsDef.value.field = value;
        }

        if (!isNil(missing)) {
            this._aggsDef.value.missing = missing;
        }

        return this;
    }

    /**
     * Sets the weight
     *
     * @param {string | Script} weight Field name or script to use as the weight.
     * @param {number=} missing Sets the missing parameter which defines how documents
     * that are missing a value should be treated.
     * @returns {WeightedAverageAggregation} returns `this` so that calls can be chained
     */
    weight(weight, missing) {
        if (typeof weight !== 'string' && !(weight instanceof Script)) {
            throw new TypeError(
                'Weight must be either a string or instanceof Script'
            );
        }

        if (weight instanceof Script) {
            if (this._aggsDef.weight.field) {
                delete this._aggsDef.weight.field;
            }
            this._aggsDef.weight.script = weight;
        } else {
            if (this._aggsDef.weight.script) {
                delete this._aggsDef.weight.script;
            }
            this._aggsDef.weight.field = weight;
        }

        if (!isNil(missing)) {
            this._aggsDef.weight.missing = missing;
        }

        return this;
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on WeightedAverageAggregation
     */
    script() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error(
            'script is not supported in WeightedAverageAggregation'
        );
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on WeightedAverageAggregation
     */
    missing() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error(
            'missing is not supported in WeightedAverageAggregation'
        );
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on WeightedAverageAggregation
     */
    field() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('field is not supported in WeightedAverageAggregation');
    }
}

module.exports = WeightedAverageAggregation;

},{"../../core":82,"./metrics-aggregation-base":50,"lodash.isnil":183}],60:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-avg-bucket-aggregation.html';

/**
 * A sibling pipeline aggregation which calculates the (mean) average value
 * of a specified metric in a sibling aggregation. The specified metric must
 * be numeric and the sibling aggregation must be a multi-bucket aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-avg-bucket-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date')
 *             .interval('month')
 *             .agg(esb.sumAggregation('sales', 'price'))
 *     )
 *     .agg(
 *         esb.avgBucketAggregation(
 *             'avg_monthly_sales',
 *             'sales_per_month>sales'
 *         )
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class AvgBucketAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'avg_bucket', ES_REF_URL, bucketsPath);
    }
}

module.exports = AvgBucketAggregation;

},{"./pipeline-aggregation-base":73}],61:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-bucket-script-aggregation.html';

/**
 * A parent pipeline aggregation which executes a script which can perform
 * per bucket computations on specified metrics in the parent multi-bucket
 * aggregation. The specified metric must be numeric and the script must
 * return a numeric value.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-bucket-script-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date', 'month')
 *             .agg(esb.sumAggregation('total_sales', 'price'))
 *             .agg(
 *                 esb.filterAggregation('t-shirts')
 *                     .filter(esb.termQuery('type', 't-shirt'))
 *                     .agg(esb.sumAggregation('sales', 'price'))
 *             )
 *             .agg(
 *                 esb.bucketScriptAggregation('t-shirt-percentage')
 *                     .bucketsPath({
 *                         tShirtSales: 't-shirts>sales',
 *                         totalSales: 'total_sales'
 *                     })
 *                     .script('params.tShirtSales / params.totalSales * 100')
 *             )
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class BucketScriptAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'bucket_script', ES_REF_URL, bucketsPath);
    }

    /**
     * Sets script parameter for aggregation.
     *
     * @param {Script|string} script
     * @returns {BucketScriptAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `script` is not an instance of `Script`
     */
    script(script) {
        this._aggsDef.script = script;
        return this;
    }
}

module.exports = BucketScriptAggregation;

},{"./pipeline-aggregation-base":73}],62:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-bucket-selector-aggregation.html';

/**
 * A parent pipeline aggregation which executes a script which determines whether
 * the current bucket will be retained in the parent multi-bucket aggregation.
 * The specified metric must be numeric and the script must return a boolean value.
 * If the script language is expression then a numeric return value is permitted.
 * In this case 0.0 will be evaluated as false and all other values will evaluate to true.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-bucket-selector-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('histo', 'date')
 *             .interval('day')
 *             .agg(esb.termsAggregation('categories', 'category'))
 *             .agg(
 *                 esb.bucketSelectorAggregation('min_bucket_selector')
 *                     .bucketsPath({ count: 'categories._bucket_count' })
 *                     .script(esb.script('inline', 'params.count != 0'))
 *             )
 *     )
 *     .size(0);
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date')
 *             .interval('month')
 *             .agg(esb.sumAggregation('sales', 'price'))
 *             .agg(
 *                 esb.bucketSelectorAggregation('sales_bucket_filter')
 *                     .bucketsPath({ totalSales: 'total_sales' })
 *                     .script('params.totalSales > 200')
 *             )
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class BucketSelectorAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'bucket_selector', ES_REF_URL, bucketsPath);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on BucketSelectorAggregation
     */
    format() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in BucketSelectorAggregation');
    }

    /**
     * Sets script parameter for aggregation. Required.
     *
     * @param {Script|string} script
     * @returns {BucketSelectorAggregation} returns `this` so that calls can be chained
     * @throws {TypeError} If `script` is not an instance of `Script`
     */
    script(script) {
        this._aggsDef.script = script;
        return this;
    }
}

module.exports = BucketSelectorAggregation;

},{"./pipeline-aggregation-base":73}],63:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-bucket-sort-aggregation.html';

/**
 * A parent pipeline aggregation which sorts the buckets of its parent
 * multi-bucket aggregation. Zero or more sort fields may be specified
 * together with the corresponding sort order. Each bucket may be sorted
 * based on its _key, _count or its sub-aggregations. In addition, parameters
 * from and size may be set in order to truncate the result buckets.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-bucket-sort-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.bucketSortAggregation('sort')
 *             .sort([
 *                  esb.sort('user', 'desc')
 *              ])
 *              .from(5)
 *              .size(10)
 *         )
 *     );
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 *
 * @extends PipelineAggregationBase
 */
class BucketSortAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name) {
        super(name, 'bucket_sort', ES_REF_URL);
    }

    /**
     * Sets the list of fields to sort on. Optional.
     *
     * @param {Array<Sort>} sort The list of fields to sort on
     * @returns {BucketSortAggregation} returns `this` so that calls can be chained
     */
    sort(sort) {
        this._aggsDef.sort = sort;
        return this;
    }

    /**
     * Sets the value buckets in positions prior to which will be truncated. Optional.
     *
     * @param {number} from Buckets in positions prior to the set value will be truncated.
     * @returns {BucketSortAggregation} returns `this` so that calls can be chained
     */
    from(from) {
        this._aggsDef.from = from;
        return this;
    }

    /**
     * Sets the number of buckets to return. Optional.
     *
     * @param {number} size The number of buckets to return.
     * @returns {BucketSortAggregation} returns `this` so that calls can be chained
     */
    size(size) {
        this._aggsDef.size = size;
        return this;
    }
}

module.exports = BucketSortAggregation;

},{"./pipeline-aggregation-base":73}],64:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-cumulative-sum-aggregation.html';

/**
 * A parent pipeline aggregation which calculates the cumulative sum of
 * a specified metric in a parent histogram (or date_histogram) aggregation.
 * The specified metric must be numeric and the enclosing histogram must
 * have min_doc_count set to 0 (default for histogram aggregations).
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-cumulative-sum-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date', 'month')
 *             .agg(esb.sumAggregation('sales', 'price'))
 *             .agg(esb.cumulativeSumAggregation('cumulative_sales', 'sales'))
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class CumulativeSumAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'cumulative_sum', ES_REF_URL, bucketsPath);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on CumulativeSumAggregation
     */
    gapPolicy() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error(
            'gapPolicy is not supported in CumulativeSumAggregation'
        );
    }
}

module.exports = CumulativeSumAggregation;

},{"./pipeline-aggregation-base":73}],65:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-derivative-aggregation.html';

/**
 * A parent pipeline aggregation which calculates the derivative of a
 * specified metric in a parent histogram (or date_histogram) aggregation.
 * The specified metric must be numeric and the enclosing histogram must
 * have min_doc_count set to 0 (default for histogram aggregations).
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-derivative-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date')
 *             .interval('month')
 *             .agg(esb.sumAggregation('sales', 'price'))
 *             .agg(esb.derivativeAggregation('sales_deriv', 'sales'))
 *     )
 *     .size(0);
 *
 * @example
 * // First and second order derivative of the monthly sales
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date')
 *             .interval('month')
 *             .agg(esb.sumAggregation('sales', 'price'))
 *             .agg(esb.derivativeAggregation('sales_deriv', 'sales'))
 *             .agg(esb.derivativeAggregation('sales_2nd_deriv', 'sales_deriv'))
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class DerivativeAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'derivative', ES_REF_URL, bucketsPath);
    }

    /**
     * Set the units of the derivative values. `unit` specifies what unit to use for
     * the x-axis of the derivative calculation
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .agg(
     *         esb.dateHistogramAggregation('sales_per_month', 'date')
     *             .interval('month')
     *             .agg(esb.sumAggregation('sales', 'price'))
     *             .agg(esb.derivativeAggregation('sales_deriv', 'sales').unit('day'))
     *     )
     *     .size(0);
     *
     * @param {string} unit `unit` specifies what unit to use for
     * the x-axis of the derivative calculation
     * @returns {DerivativeAggregation} returns `this` so that calls can be chained
     */
    unit(unit) {
        this._aggsDef.unit = unit;
        return this;
    }
}

module.exports = DerivativeAggregation;

},{"./pipeline-aggregation-base":73}],66:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-extended-stats-bucket-aggregation.html';

/**
 * A sibling pipeline aggregation which calculates a variety of stats across
 * all bucket of a specified metric in a sibling aggregation. The specified
 * metric must be numeric and the sibling aggregation must be a multi-bucket
 * aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-extended-stats-bucket-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date')
 *             .interval('month')
 *             .agg(esb.sumAggregation('sales', 'price'))
 *     )
 *     .agg(
 *         // Calculates extended stats for monthly sales
 *         esb.extendedStatsBucketAggregation(
 *             'stats_monthly_sales',
 *             'sales_per_month>sales'
 *         )
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class ExtendedStatsBucketAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'extended_stats_bucket', ES_REF_URL, bucketsPath);
    }

    /**
     * Sets the number of standard deviations above/below the mean to display.
     * Optional.
     *
     * @param {number} sigma Default is 2.
     * @returns {ExtendedStatsBucketAggregation} returns `this` so that calls can be chained
     */
    sigma(sigma) {
        this._aggsDef.sigma = sigma;
        return this;
    }
}

module.exports = ExtendedStatsBucketAggregation;

},{"./pipeline-aggregation-base":73}],67:[function(require,module,exports){
'use strict';

exports.PipelineAggregationBase = require('./pipeline-aggregation-base');

exports.AvgBucketAggregation = require('./avg-bucket-aggregation');
exports.DerivativeAggregation = require('./derivative-aggregation');
exports.MaxBucketAggregation = require('./max-bucket-aggregation');
exports.MinBucketAggregation = require('./min-bucket-aggregation');
exports.SumBucketAggregation = require('./sum-bucket-aggregation');
exports.StatsBucketAggregation = require('./stats-bucket-aggregation');
exports.ExtendedStatsBucketAggregation = require('./extended-stats-bucket-aggregation');
exports.PercentilesBucketAggregation = require('./percentiles-bucket-aggregation');
exports.MovingAverageAggregation = require('./moving-average-aggregation');
exports.MovingFunctionAggregation = require('./moving-function-aggregation');
exports.CumulativeSumAggregation = require('./cumulative-sum-aggregation');
exports.BucketScriptAggregation = require('./bucket-script-aggregation');
exports.BucketSelectorAggregation = require('./bucket-selector-aggregation');
exports.SerialDifferencingAggregation = require('./serial-differencing-aggregation');
exports.BucketSortAggregation = require('./bucket-sort-aggregation');

},{"./avg-bucket-aggregation":60,"./bucket-script-aggregation":61,"./bucket-selector-aggregation":62,"./bucket-sort-aggregation":63,"./cumulative-sum-aggregation":64,"./derivative-aggregation":65,"./extended-stats-bucket-aggregation":66,"./max-bucket-aggregation":68,"./min-bucket-aggregation":69,"./moving-average-aggregation":70,"./moving-function-aggregation":71,"./percentiles-bucket-aggregation":72,"./pipeline-aggregation-base":73,"./serial-differencing-aggregation":74,"./stats-bucket-aggregation":75,"./sum-bucket-aggregation":76}],68:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-max-bucket-aggregation.html';

/**
 * A sibling pipeline aggregation which identifies the bucket(s) with
 * the maximum value of a specified metric in a sibling aggregation and
 * outputs both the value and the key(s) of the bucket(s). The specified
 * metric must be numeric and the sibling aggregation must be a multi-bucket
 * aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-max-bucket-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date')
 *             .interval('month')
 *             .agg(esb.sumAggregation('sales', 'price'))
 *     )
 *     .agg(
 *         // Metric embedded in sibling aggregation
 *         // Get the maximum value of `sales` aggregation in
 *         // `sales_per_month` histogram
 *         esb.maxBucketAggregation(
 *             'max_monthly_sales',
 *             'sales_per_month>sales'
 *         )
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class MaxBucketAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'max_bucket', ES_REF_URL, bucketsPath);
    }
}

module.exports = MaxBucketAggregation;

},{"./pipeline-aggregation-base":73}],69:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-min-bucket-aggregation.html';

/**
 * A sibling pipeline aggregation which identifies the bucket(s) with
 * the minimum value of a specified metric in a sibling aggregation and
 * outputs both the value and the key(s) of the bucket(s). The specified
 * metric must be numeric and the sibling aggregation must be a multi-bucket
 * aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-min-bucket-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date')
 *             .interval('month')
 *             .agg(esb.sumAggregation('sales', 'price'))
 *     )
 *     .agg(
 *         // Metric embedded in sibling aggregation
 *         // Get the minimum value of `sales` aggregation in
 *         // `sales_per_month` histogram
 *         esb.minBucketAggregation(
 *             'min_monthly_sales',
 *             'sales_per_month>sales'
 *         )
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class MinBucketAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'min_bucket', ES_REF_URL, bucketsPath);
    }
}

module.exports = MinBucketAggregation;

},{"./pipeline-aggregation-base":73}],70:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { invalidParam },
    consts: { MODEL_SET }
} = require('../../core');

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-movavg-aggregation.html';

const invalidModelParam = invalidParam(ES_REF_URL, 'model', MODEL_SET);

/**
 * Given an ordered series of data, the Moving Average aggregation will
 * slide a window across the data and emit the average value of that window.
 *
 * `moving_avg` aggregations must be embedded inside of a histogram or
 * date_histogram aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-movavg-aggregation.html)
 *
 * @example
 * const agg = esb.movingAverageAggregation('the_movavg', 'the_sum')
 *     .model('holt')
 *     .window(5)
 *     .gapPolicy('insert_zeros')
 *     .settings({ alpha: 0.8 });
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('my_date_histo', 'timestamp')
 *             .interval('day')
 *             .agg(esb.sumAggregation('the_sum', 'lemmings'))
 *             // Relative path to sibling metric `the_sum`
 *             .agg(esb.movingAverageAggregation('the_movavg', 'the_sum'))
 *     )
 *     .size(0);
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('my_date_histo', 'timestamp')
 *             .interval('day')
 *             // Use the document count as it's input
 *             .agg(esb.movingAverageAggregation('the_movavg', '_count'))
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class MovingAverageAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'moving_avg', ES_REF_URL, bucketsPath);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on MovingAverageAggregation
     */
    format() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('format is not supported in MovingAverageAggregation');
    }

    /**
     * Sets the moving average weighting model that we wish to use. Optional.
     *
     * @example
     * const agg = esb.movingAverageAggregation('the_movavg', 'the_sum')
     *     .model('simple')
     *     .window(30);
     *
     * @example
     * const agg = esb.movingAverageAggregation('the_movavg', 'the_sum')
     *     .model('ewma')
     *     .window(30)
     *     .settings({ alpha: 0.8 });
     *
     * @param {string} model Can be `simple`, `linear`,
     * `ewma` (aka "single-exponential"), `holt` (aka "double exponential")
     * or `holt_winters` (aka "triple exponential").
     * Default is `simple`
     * @returns {MovingAverageAggregation} returns `this` so that calls can be chained
     */
    model(model) {
        if (isNil(model)) invalidModelParam(model);

        const modelLower = model.toLowerCase();
        if (!MODEL_SET.has(modelLower)) invalidModelParam(model);

        this._aggsDef.model = modelLower;
        return this;
    }

    /**
     * Sets the size of window to "slide" across the histogram. Optional.
     *
     * @example
     * const agg = esb.movingAverageAggregation('the_movavg', 'the_sum')
     *     .model('simple')
     *     .window(30)
     *
     * @param {number} window Default is 5
     * @returns {MovingAverageAggregation} returns `this` so that calls can be chained
     */
    window(window) {
        this._aggsDef.window = window;
        return this;
    }

    /**
     * If the model should be algorithmically minimized. Optional.
     * Applicable on EWMA, Holt-Linear, Holt-Winters.
     * Minimization is disabled by default for `ewma` and `holt_linear`,
     * while it is enabled by default for `holt_winters`.
     *
     * @example
     * const agg = esb.movingAverageAggregation('the_movavg', 'the_sum')
     *     .model('holt_winters')
     *     .window(30)
     *     .minimize(true)
     *     .settings({ period: 7 });
     *
     * @param {boolean} enable `false` for most models
     * @returns {MovingAverageAggregation} returns `this` so that calls can be chained
     */
    minimize(enable) {
        this._aggsDef.minimize = enable;
        return this;
    }

    /**
     * Model-specific settings, contents which differ depending on the model specified.
     * Optional.
     *
     * @example
     * const agg = esb.movingAverageAggregation('the_movavg', 'the_sum')
     *     .model('ewma')
     *     .window(30)
     *     .settings({ alpha: 0.8 });
     *
     * @param {Object} settings
     * @returns {MovingAverageAggregation} returns `this` so that calls can be chaineds
     */
    settings(settings) {
        this._aggsDef.settings = settings;
        return this;
    }

    /**
     * Enable "prediction" mode, which will attempt to extrapolate into the future given
     * the current smoothed, moving average
     *
     * @example
     * const agg = esb.movingAverageAggregation('the_movavg', 'the_sum')
     *     .model('simple')
     *     .window(30)
     *     .predict(10);
     *
     * @param {number} predict the number of predictions you would like appended to the
     * end of the series
     * @returns {MovingAverageAggregation} returns `this` so that calls can be chained
     */
    predict(predict) {
        this._aggsDef.predict = predict;
        return this;
    }
}

module.exports = MovingAverageAggregation;

},{"../../core":82,"./pipeline-aggregation-base":73,"lodash.isnil":183}],71:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-movfn-aggregation.html';

/**
 * Given an ordered series of data, the Moving Function aggregation
 * will slide a window across the data and allow the user to specify
 * a custom script that is executed on each window of data.
 * For convenience, a number of common functions are predefined such as min/max, moving averages, etc.
 *
 * `moving_fn` aggregations must be embedded inside of a histogram or
 * date_histogram aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-movfn-aggregation.html)
 *
 * NOTE: Only available in Elasticsearch 6.4.0+.
 *
 * @example
 * const agg = esb.movingFunctionAggregation('the_movfn', 'the_sum')
 *     .model('holt')
 *     .window(5)
 *     .gapPolicy('insert_zeros')
 *     .settings({ alpha: 0.8 });
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('my_date_histo', 'timestamp')
 *             .interval('day')
 *             .agg(esb.sumAggregation('the_sum', 'lemmings'))
 *             // Relative path to sibling metric `the_sum`
 *             .agg(esb.movingFunctionAggregation('the_movfn', 'the_sum'))
 *     )
 *     .size(0);
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('my_date_histo', 'timestamp')
 *             .interval('day')
 *             // Use the document count as it's input
 *             .agg(esb.movingFunctionAggregation('the_movfn', '_count'))
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over.
 * @param {string=} window The size of window to "slide" across the histogram.
 * @param {string=} script The script that should be executed on each window of data.
 *
 * @extends PipelineAggregationBase
 */
class MovingFunctionAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath, window, script) {
        super(name, 'moving_fn', ES_REF_URL, bucketsPath);

        if (!isNil(window)) this._aggsDef.window = window;
        if (!isNil(script)) this._aggsDef.script = script;
    }

    /**
     * Sets the size of window to "slide" across the histogram. Optional.
     *
     * @example
     * const agg = esb.movingFunctionAggregation('the_movfn', 'the_sum')
     *     .window(30)
     *
     * @param {number} window Default is 5
     * @returns {MovingFunctionAggregation} returns `this` so that calls can be chained
     */
    window(window) {
        this._aggsDef.window = window;
        return this;
    }

    /**
     * Sets shift of window position. Optional.
     *
     * @example
     * const agg = esb.movingFunctionAggregation('the_movfn', 'the_sum')
     *     .shift(30)
     *
     * @param {number} shift Default is 0
     * @returns {MovingFunctionAggregation} returns `this` so that calls can be chained
     */
    shift(shift) {
        this._aggsDef.shift = shift;
        return this;
    }

    /**
     * Sets the script that should be executed on each window of data. Required.
     *
     * @example
     * const agg = esb.movingFunctionAggregation('the_movfn', 'the_sum', "MovingFunctions.unweightedAvg(values)"")
     *     .script("MovingFunctions.unweightedAvg(values)")
     *
     * @param {string} script
     * @returns {MovingFunctionAggregation} returns `this` so that calls can be chained
     */
    script(script) {
        this._aggsDef.script = script;
        return this;
    }
}

module.exports = MovingFunctionAggregation;

},{"./pipeline-aggregation-base":73,"lodash.isnil":183}],72:[function(require,module,exports){
'use strict';

const {
    util: { checkType }
} = require('../../core');

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-percentiles-bucket-aggregation.html';

/**
 * A sibling pipeline aggregation which calculates percentiles across all
 * bucket of a specified metric in a sibling aggregation. The specified
 * metric must be numeric and the sibling aggregation must be a multi-bucket
 * aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-percentiles-bucket-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date')
 *             .interval('month')
 *             .agg(esb.sumAggregation('sales', 'price'))
 *     )
 *     .agg(
 *         // Calculates stats for monthly sales
 *         esb.percentilesBucketAggregation(
 *             'percentiles_monthly_sales',
 *             'sales_per_month>sales'
 *         ).percents([25.0, 50.0, 75.0])
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class PercentilesBucketAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'percentiles_bucket', ES_REF_URL, bucketsPath);
    }

    /**
     * Sets the list of percentiles to calculate
     *
     * @param {Array<number>} percents The list of percentiles to calculate
     * @returns {PercentilesBucketAggregation} returns `this` so that calls can be chained
     */
    percents(percents) {
        checkType(percents, Array);

        this._aggsDef.percents = percents;
        return this;
    }
}

module.exports = PercentilesBucketAggregation;

},{"../../core":82,"./pipeline-aggregation-base":73}],73:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Aggregation,
    util: { invalidParam }
} = require('../../core');

const invalidGapPolicyParam = invalidParam(
    '',
    'gap_policy',
    "'skip' or 'insert_zeros'"
);

/**
 * The `PipelineAggregationBase` provides support for common options used across
 * various pipeline `Aggregation` implementations.
 *
 * Pipeline aggregations cannot have sub-aggregations but depending on the type
 * it can reference another pipeline in the buckets_path allowing pipeline
 * aggregations to be chained. For example, you can chain together two derivatives
 * to calculate the second derivative (i.e. a derivative of a derivative).
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} name a valid aggregation name
 * @param {string} aggType type of aggregation
 * @param {string} refUrl Elasticsearch reference URL
 * @param {string|Object=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends Aggregation
 */
class PipelineAggregationBase extends Aggregation {
    // eslint-disable-next-line require-jsdoc
    constructor(name, aggType, refUrl, bucketsPath) {
        super(name, aggType);

        this._refUrl = refUrl;

        if (!isNil(bucketsPath)) this._aggsDef.buckets_path = bucketsPath;
    }

    /**
     * Sets the relative path, `buckets_path`, which refers to the metric to aggregate over.
     * Required.
     *
     * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline.html#buckets-path-syntax)
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .agg(
     *         esb.dateHistogramAggregation('histo', 'date')
     *             .interval('day')
     *             .agg(esb.termsAggregation('categories', 'category'))
     *             .agg(
     *                 esb.bucketSelectorAggregation('min_bucket_selector')
     *                     .bucketsPath({ count: 'categories._bucket_count' })
     *                     .script(esb.script('inline', 'params.count != 0'))
     *             )
     *     )
     *     .size(0);
     *
     * @param {string|Object} path
     * @returns {PipelineAggregationBase} returns `this` so that calls can be chained
     */
    bucketsPath(path) {
        this._aggsDef.buckets_path = path;
        return this;
    }

    /**
     * Set policy for missing data. Optional.
     *
     * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline.html#gap-policy)
     *
     * @param {string} policy Can be `skip` or `insert_zeros`
     * @returns {PipelineAggregationBase} returns `this` so that calls can be chained
     */
    gapPolicy(policy) {
        if (isNil(policy)) invalidGapPolicyParam(policy, this._refUrl);

        const policyLower = policy.toLowerCase();
        if (policyLower !== 'skip' && policyLower !== 'insert_zeros') {
            invalidGapPolicyParam(policy, this._refUrl);
        }

        this._aggsDef.gap_policy = policyLower;
        return this;
    }

    /**
     * Sets the format expression if applicable. Optional.
     *
     * @param {string} fmt Format mask to apply on aggregation response. Example: ####.00
     * @returns {PipelineAggregationBase} returns `this` so that calls can be chained
     */
    format(fmt) {
        this._aggsDef.format = fmt;
        return this;
    }
}

module.exports = PipelineAggregationBase;

},{"../../core":82,"lodash.isnil":183}],74:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-serialdiff-aggregation.html';

/**
 * Serial differencing is a technique where values in a time series are
 * subtracted from itself at different time lags or periods.
 *
 * Serial differences are built by first specifying a `histogram` or `date_histogram` over a field.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-serialdiff-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('my_date_histo', 'timestamp')
 *             .interval('day')
 *             .agg(esb.sumAggregation('the_sum', 'lemmings'))
 *             .agg(
 *                 esb.serialDifferencingAggregation(
 *                     'thirtieth_difference',
 *                     'the_sum'
 *                 ).lag(30)
 *             )
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class SerialDifferencingAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'serial_diff', ES_REF_URL, bucketsPath);
    }

    /**
     * The historical bucket to subtract from the current value.
     * Optional.
     *
     * @param {number} lag Default is 1.
     * @returns {SerialDifferencingAggregation} returns `this` so that calls can be chained
     */
    lag(lag) {
        this._aggsDef.lag = lag;
        return this;
    }
}

module.exports = SerialDifferencingAggregation;

},{"./pipeline-aggregation-base":73}],75:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-stats-bucket-aggregation.html';

/**
 * A sibling pipeline aggregation which calculates a variety of stats across
 * all bucket of a specified metric in a sibling aggregation. The specified
 * metric must be numeric and the sibling aggregation must be a multi-bucket
 * aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-stats-bucket-aggregation.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date')
 *             .interval('month')
 *             .agg(esb.sumAggregation('sales', 'price'))
 *     )
 *     .agg(
 *         // Calculates stats for monthly sales
 *         esb.statsBucketAggregation(
 *             'stats_monthly_sales',
 *             'sales_per_month>sales'
 *         )
 *     )
 *     .size(0);
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @extends PipelineAggregationBase
 */
class StatsBucketAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'stats_bucket', ES_REF_URL, bucketsPath);
    }
}

module.exports = StatsBucketAggregation;

},{"./pipeline-aggregation-base":73}],76:[function(require,module,exports){
'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-sum-bucket-aggregation.html';

/**
 * A sibling pipeline aggregation which calculates the sum across all bucket
 * of a specified metric in a sibling aggregation. The specified metric must
 * be numeric and the sibling aggregation must be a multi-bucket aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-sum-bucket-aggregation.html)
 *
 * @param {string} name The name which will be used to refer to this aggregation.
 * @param {string=} bucketsPath The relative path of metric to aggregate over
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .agg(
 *         esb.dateHistogramAggregation('sales_per_month', 'date')
 *             .interval('month')
 *             .agg(esb.sumAggregation('sales', 'price'))
 *     )
 *     .agg(
 *         // Get the sum of all the total monthly `sales` buckets
 *         esb.sumBucketAggregation(
 *             'sum_monthly_sales',
 *             'sales_per_month>sales'
 *         )
 *     )
 *     .size(0);
 *
 * @extends PipelineAggregationBase
 */
class SumBucketAggregation extends PipelineAggregationBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, bucketsPath) {
        super(name, 'sum_bucket', ES_REF_URL, bucketsPath);
    }
}

module.exports = SumBucketAggregation;

},{"./pipeline-aggregation-base":73}],77:[function(require,module,exports){
'use strict';

const has = require('lodash.has');
const isEmpty = require('lodash.isempty');

const { checkType, recursiveToJSON } = require('./util');

/**
 * Base class implementation for all aggregation types.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class should be extended and used, as validation against the class
 * type is present in various places.
 *
 * @param {string} name
 * @param {string} aggType Type of aggregation
 *
 * @throws {Error} if `name` is empty
 * @throws {Error} if `aggType` is empty
 */
class Aggregation {
    // eslint-disable-next-line require-jsdoc
    constructor(name, aggType) {
        if (isEmpty(aggType))
            throw new Error('Aggregation `aggType` cannot be empty');

        this._name = name;
        this.aggType = aggType;

        this._aggs = {};
        this._aggsDef = this._aggs[aggType] = {};
        this._nestedAggs = [];
    }

    // TODO: Investigate case when getter for aggregation will be required

    /**
     * Sets name for aggregation.
     *
     * @param {string} name returns `this` so that calls can be chained.
     * @returns {Aggregation}
     */
    name(name) {
        this._name = name;
        return this;
    }

    /**
     * Sets nested aggregations.
     * This method can be called multiple times in order to set multiple nested aggregations.
     *
     * @param {Aggregation} agg Any valid {@link Aggregation}
     * @returns {Aggregation} returns `this` so that calls can be chained.
     * @throws {TypeError} If `agg` is not an instance of `Aggregation`
     */
    aggregation(agg) {
        checkType(agg, Aggregation);

        // Possible to check for Global aggregation?
        // Global aggregation can only be at the top level.

        this._nestedAggs.push(agg);

        return this;
    }

    /**
     * Sets nested aggregation.
     * This method can be called multiple times in order to set multiple nested aggregations.
     *
     * @param {Aggregation} agg Any valid {@link Aggregation}
     * @returns {Aggregation} returns `this` so that calls can be chained.
     */
    agg(agg) {
        return this.aggregation(agg);
    }

    /**
     * Sets multiple nested aggregation items.
     * This method accepts an array to set multiple nested aggregations in one call.
     *
     * @param {Array<Aggregation>} aggs Array of valid {@link Aggregation} items
     * @returns {Aggregation} returns `this` so that calls can be chained.
     * @throws {TypeError} If `aggs` is not an instance of `Array`
     * @throws {TypeError} If `aggs` contains instances not of type `Aggregation`
     */
    aggregations(aggs) {
        checkType(aggs, Array);

        aggs.forEach(agg => this.aggregation(agg));

        return this;
    }

    /**
     * Sets multiple nested aggregation items.
     * Alias for method `aggregations`
     *
     * @param {Array<Aggregation>} aggs Array of valid {@link Aggregation} items
     * @returns {Aggregation} returns `this` so that calls can be chained.
     * @throws {TypeError} If `aggs` is not an instance of `Array`
     * @throws {TypeError} If `aggs` contains instances not of type `Aggregation`
     */
    aggs(aggs) {
        return this.aggregations(aggs);
    }

    /**
     * You can associate a piece of metadata with individual aggregations at request time
     * that will be returned in place at response time.
     *
     * @param {Object} meta
     * @returns {Aggregation} returns `this` so that calls can be chained.
     */
    meta(meta) {
        this._aggs.meta = meta;
        return this;
    }

    /**
     * Internal helper function for determining the aggregation name.
     *
     * @returns {string} Aggregation name
     * @private
     */
    _aggsName() {
        if (!isEmpty(this._name)) return this._name;

        if (has(this._aggsDef, 'field')) {
            return `agg_${this.aggType}_${this._aggsDef.field}`;
        }

        // At this point, it would be difficult to construct a unique
        // aggregation name. Error out.
        throw new Error('Aggregation name could not be determined');
    }

    /**
     * Build and returns DSL representation of the `Aggregation` class instance.
     *
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    getDSL() {
        return this.toJSON();
    }

    /**
     * Override default `toJSON` to return DSL representation for the `aggregation` query.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        const mainAggs = recursiveToJSON(this._aggs);

        if (!isEmpty(this._nestedAggs)) {
            mainAggs.aggs = Object.assign(
                {},
                ...recursiveToJSON(this._nestedAggs)
            );
        }

        return { [this._aggsName()]: mainAggs };
    }
}

module.exports = Aggregation;

},{"./util":95,"lodash.has":179,"lodash.isempty":182}],78:[function(require,module,exports){
'use strict';

// Used in Fiversified Sampler aggrenation
exports.EXECUTION_HINT_SET = new Set([
    'map',
    'global_ordinals',
    'global_ordinals_hash',
    'global_ordinals_low_cardinality'
]);

// Used in Geo Point Aggregation
// prettier-ignore
exports.UNIT_SET = new Set(
    [
        'in', 'inch',
        'yd', 'yards',
        'ft', 'feet',
        'km', 'kilometers',
        'NM', 'nmi', 'nauticalmiles',
        'mm', 'millimeters',
        'cm', 'centimeters',
        'mi', 'miles',
        'm', 'meters'
    ]
);

exports.MODEL_SET = new Set([
    'simple',
    'linear',
    'ewma',
    'holt',
    'holt_winters'
]);

exports.SORT_MODE_SET = new Set(['min', 'max', 'sum', 'avg', 'median']);

exports.RESCORE_MODE_SET = new Set(['total', 'multiply', 'min', 'max', 'avg']);

exports.REWRITE_METHOD_SET = new Set([
    'constant_score',
    'constant_score_auto',
    'constant_score_filter',
    'scoring_boolean',
    'constant_score_boolean',
    'top_terms_N',
    'top_terms_boost_N',
    'top_terms_blended_freqs_N'
]);

exports.MULTI_MATCH_TYPE = new Set([
    'best_fields',
    'most_fields',
    'cross_fields',
    'phrase',
    'phrase_prefix',
    'bool_prefix'
]);

exports.SCORE_MODE_SET = new Set([
    'multiply',
    'sum',
    'first',
    'min',
    'max',
    'avg'
]);

exports.BOOST_MODE_SET = new Set([
    'multiply',
    'sum',
    'replace',
    'min',
    'max',
    'avg'
]);

exports.FIELD_MODIFIER_SET = new Set([
    'none',
    'log',
    'log1p',
    'log2p',
    'ln',
    'ln1p',
    'ln2p',
    'square',
    'sqrt',
    'reciprocal'
]);

exports.NESTED_SCORE_MODE_SET = new Set(['none', 'sum', 'min', 'max', 'avg']);

exports.GEO_SHAPE_TYPES = new Set([
    'point',
    'linestring',
    'polygon',
    'multipoint',
    'multilinestring',
    'multipolygon',
    'geometrycollection',
    'envelope',
    'circle'
]);

exports.GEO_RELATION_SET = new Set([
    'WITHIN',
    'CONTAINS',
    'DISJOINT',
    'INTERSECTS'
]);

exports.SUGGEST_MODE_SET = new Set(['missing', 'popular', 'always']);

exports.STRING_DISTANCE_SET = new Set([
    'internal',
    'damerau_levenshtein',
    'levenstein',
    'jarowinkler',
    'ngram'
]);

exports.SMOOTHING_MODEL_SET = new Set([
    'stupid_backoff',
    'laplace',
    'linear_interpolation'
]);

},{}],79:[function(require,module,exports){
'use strict';

const isObject = require('lodash.isobject');
const isNil = require('lodash.isnil');

const { checkType } = require('./util');

/**
 * A `GeoPoint` object that can be used in queries and filters that
 * take a `GeoPoint`.  `GeoPoint` supports various input formats.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-point.html)
 */
class GeoPoint {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        // Take optional parameter and call appropriate method?
        // Will have to check for string, object and array.
        // this will be set depending on subsequent method called
        this._point = null;
    }

    /**
     * Print warning message to console namespaced by class name.
     *
     * @param {string} msg
     * @private
     */
    _warn(msg) {
        console.warn(`[GeoPoint] ${msg}`);
    }

    /**
     * Print warning messages to not mix Geo Point representations
     * @private
     */
    _warnMixedRepr() {
        this._warn('Do not mix with other representation!');
        this._warn('Overwriting.');
    }

    /**
     * Check the instance for object representation of Geo Point.
     * If representation is null, new object is initialised.
     * If it is not null, warning is logged and point is overwritten.
     * @private
     */
    _checkObjRepr() {
        if (isNil(this._point)) this._point = {};
        else if (!isObject(this._point)) {
            this._warnMixedRepr();
            this._point = {};
        }
    }

    /**
     * Sets the latitude for the object representation.
     *
     * @param {number} lat Latitude
     * @returns {GeoPoint} returns `this` so that calls can be chained
     */
    lat(lat) {
        this._checkObjRepr();

        this._point.lat = lat;
        return this;
    }

    /**
     * Sets the longitude for the object representation.
     *
     * @param {number} lon Longitude
     * @returns {GeoPoint} returns `this` so that calls can be chained
     */
    lon(lon) {
        this._checkObjRepr();

        this._point.lon = lon;
        return this;
    }

    /**
     * Sets the Geo Point value expressed as an object,
     * with `lat` and `lon` keys.
     *
     * @param {Object} point
     * @returns {GeoPoint} returns `this` so that calls can be chained
     * @throws {TypeError} If `point` is not an instance of object
     */
    object(point) {
        checkType(point, Object);

        !isNil(this._point) && this._warnMixedRepr();

        this._point = point;
        return this; // This doesn't make much sense. What else are you gonna call?
    }

    /**
     * Sets the Geo Point value expressed as an array
     * with the format: `[ lon, lat ]`.
     *
     * @param {Array<number>} point Array in format `[ lon, lat ]`(`GeoJson` standard)
     * @returns {GeoPoint} returns `this` so that calls can be chained
     * @throws {TypeError} If `point` is not an instance of Array
     */
    array(point) {
        checkType(point, Array);

        !isNil(this._point) && this._warnMixedRepr();

        this._point = point;
        return this; // This doesn't make much sense. What else are you gonna call?
    }

    /**
     * Sets Geo-point expressed as a string with the format: `"lat,lon"`
     * or as a geo hash
     *
     * @param {string} point
     * @returns {GeoPoint} returns `this` so that calls can be chained
     */
    string(point) {
        !isNil(this._point) && this._warnMixedRepr();

        this._point = point;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for the `GeoPoint`
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        return this._point;
    }
}

module.exports = GeoPoint;

},{"./util":95,"lodash.isnil":183,"lodash.isobject":184}],80:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');
const has = require('lodash.has');

const { checkType, invalidParam } = require('./util');
const { GEO_SHAPE_TYPES } = require('./consts');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-shape.html';

const invalidTypeParam = invalidParam(ES_REF_URL, 'type', GEO_SHAPE_TYPES);

/**
 * Shape object that can be used in queries and filters that
 * take a Shape. Shape uses the GeoJSON format.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-shape.html)
 *
 * @example
 * // Pass options using method
 * const shape = esb.geoShape()
 *     .type('linestring')
 *     .coordinates([[-77.03653, 38.897676], [-77.009051, 38.889939]]);
 *
 * @example
 * // Pass parameters using contructor
 * const shape = esb.geoShape('multipoint', [[102.0, 2.0], [103.0, 2.0]])
 *
 * @param {string=} type A valid shape type.
 * Can be one of `point`, `linestring`, `polygon`, `multipoint`, `multilinestring`,
 * `multipolygon`, `geometrycollection`, `envelope` and `circle`
 * @param {Array=} coords A valid coordinat definition for the given shape.
 */
class GeoShape {
    // eslint-disable-next-line require-jsdoc
    constructor(type, coords) {
        this._body = {};

        if (!isNil(type)) this.type(type);
        if (!isNil(coords)) this.coordinates(coords);
    }

    /**
     * Sets the GeoJSON format type used to represent shape.
     *
     * @example
     * const shape = esb.geoShape()
     *     .type('envelope')
     *     .coordinates([[-45.0, 45.0], [45.0, -45.0]])
     *
     * @param {string} type A valid shape type.
     * Can be one of `point`, `linestring`, `polygon`, `multipoint`, `multilinestring`,
     * `multipolygon`, `geometrycollection`, `envelope`, `circle`
     * @returns {GeoShape} returns `this` so that calls can be chained.
     */
    type(type) {
        if (isNil(type)) invalidTypeParam(type);

        const typeLower = type.toLowerCase();
        if (!GEO_SHAPE_TYPES.has(typeLower)) invalidTypeParam(type);

        this._body.type = typeLower;
        return this;
    }

    /**
     * Sets the coordinates for the shape definition. Note, the coordinates
     * are not validated in this api. Please see [GeoJSON](http://geojson.org/geojson-spec.html#geometry-objects)
     * and [ElasticSearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-shape.html#input-structure) for correct coordinate definitions.
     *
     * @example
     * const shape = esb.geoShape()
     *     .type('point')
     *     .coordinates([-77.03653, 38.897676])
     *
     * @param {Array<Array<number>>|Array<number>} coords
     * @returns {GeoShape} returns `this` so that calls can be chained.
     */
    coordinates(coords) {
        checkType(coords, Array);

        this._body.coordinates = coords;
        return this;
    }

    /**
     * Sets the radius for parsing a circle `GeoShape`.
     *
     * @example
     * const shape = esb.geoShape()
     *     .type('circle')
     *     .coordinates([-45.0, 45.0])
     *     .radius('100m')
     *
     * @param {string|number} radius The radius for shape circle.
     * @returns {GeoShape} returns `this` so that calls can be chained.
     */
    radius(radius) {
        // Should this have a validation for circle shape type?
        this._body.radius = radius;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation of the geo shape
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        if (!has(this._body, 'type') || !has(this._body, 'coordinates')) {
            throw new Error(
                'For all types, both the inner `type` and `coordinates` fields are required.'
            );
        }
        return this._body;
    }
}

module.exports = GeoShape;

},{"./consts":78,"./util":95,"lodash.has":179,"lodash.isnil":183}],81:[function(require,module,exports){
'use strict';

const has = require('lodash.has'),
    isEmpty = require('lodash.isempty'),
    isNil = require('lodash.isnil'),
    isString = require('lodash.isstring');

const Query = require('./query');
const { checkType, invalidParam, recursiveToJSON } = require('./util');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-highlighting.html';

const invalidEncoderParam = invalidParam(
    ES_REF_URL,
    'encoder',
    "'default' or 'html'"
);
const invalidTypeParam = invalidParam(
    ES_REF_URL,
    'type',
    "'plain', 'postings' or 'fvh'"
);
const invalidFragmenterParam = invalidParam(
    ES_REF_URL,
    'fragmenter',
    "'simple' or 'span'"
);

/**
 * Allows to highlight search results on one or more fields. In order to
 * perform highlighting, the actual content of the field is required. If the
 * field in question is stored (has store set to yes in the mapping), it will
 * be used, otherwise, the actual _source will be loaded and the relevant
 * field will be extracted from it.
 *
 * If no term_vector information is provided (by setting it to
 * `with_positions_offsets` in the mapping), then the plain highlighter will be
 * used. If it is provided, then the fast vector highlighter will be used.
 * When term vectors are available, highlighting will be performed faster at
 * the cost of bigger index size.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-highlighting.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.matchAllQuery())
 *     .highlight(esb.highlight('content'));
 *
 * @example
 * const highlight = esb.highlight()
 *     .numberOfFragments(3)
 *     .fragmentSize(150)
 *     .fields(['_all', 'bio.title', 'bio.author', 'bio.content'])
 *     .preTags('<em>', '_all')
 *     .postTags('</em>', '_all')
 *     .numberOfFragments(0, 'bio.title')
 *     .numberOfFragments(0, 'bio.author')
 *     .numberOfFragments(5, 'bio.content')
 *     .scoreOrder('bio.content');
 *
 * highlight.toJSON()
 * {
 *     "number_of_fragments" : 3,
 *     "fragment_size" : 150,
 *     "fields" : {
 *         "_all" : { "pre_tags" : ["<em>"], "post_tags" : ["</em>"] },
 *         "bio.title" : { "number_of_fragments" : 0 },
 *         "bio.author" : { "number_of_fragments" : 0 },
 *         "bio.content" : { "number_of_fragments" : 5, "order" : "score" }
 *     }
 *  }
 *
 * @param {string|Array=} fields An optional field or array of fields to highlight.
 */
class Highlight {
    // eslint-disable-next-line require-jsdoc
    constructor(fields) {
        this._fields = {};
        this._highlight = { fields: this._fields };

        // Does this smell?
        if (isNil(fields)) return;

        if (isString(fields)) this.field(fields);
        else this.fields(fields);
    }

    /**
     * Private function to set field option
     *
     * @param {string|null} field
     * @param {string} option
     * @param {string} val
     * @private
     */
    _setFieldOption(field, option, val) {
        if (isNil(field)) {
            this._highlight[option] = val;
            return;
        }

        this.field(field);
        this._fields[field][option] = val;
    }

    /**
     * Allows you to set a field that will be highlighted. The field is
     * added to the current list of fields.
     *
     * @param {string} field A field name.
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    field(field) {
        if (!isNil(field) && !has(this._fields, field)) {
            this._fields[field] = {};
        }

        return this;
    }

    /**
     * Allows you to set the fields that will be highlighted. All fields are
     * added to the current list of fields.
     *
     * @param {Array<string>} fields Array of field names.
     * @returns {Highlight} returns `this` so that calls can be chained
     * @throws {TypeError} If `fields` is not an instance of Array
     */
    fields(fields) {
        checkType(fields, Array);

        fields.forEach(field => this.field(field));
        return this;
    }

    /**
     * Sets the pre tags for highlighted fragments. You can apply the
     * tags to a specific field by passing the optional field name parameter.
     *
     * @example
     * const highlight = esb.highlight('_all')
     *     .preTags('<tag1>')
     *     .postTags('</tag1>');
     *
     * @example
     * const highlight = esb.highlight('_all')
     *     .preTags(['<tag1>', '<tag2>'])
     *     .postTags(['</tag1>', '</tag2>']);
     *
     * @param {string|Array} tags
     * @param {string=} field
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    preTags(tags, field) {
        this._setFieldOption(field, 'pre_tags', isString(tags) ? [tags] : tags);
        return this;
    }

    /**
     * Sets the post tags for highlighted fragments. You can apply the
     * tags to a specific field by passing the optional field name parameter.
     *
     * @example
     * const highlight = esb.highlight('_all')
     *     .preTags('<tag1>')
     *     .postTags('</tag1>');
     *
     * @example
     * const highlight = esb.highlight('_all')
     *     .preTags(['<tag1>', '<tag2>'])
     *     .postTags(['</tag1>', '</tag2>']);
     *
     * @param {string|Array} tags
     * @param {string=} field
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    postTags(tags, field) {
        this._setFieldOption(
            field,
            'post_tags',
            isString(tags) ? [tags] : tags
        );
        return this;
    }

    /**
     * Sets the styled schema to be used for the tags.
     *
     * styled - 10 `<em>` pre tags with css class of hltN, where N is 1-10
     *
     * @example
     * const highlight = esb.highlight('content').styledTagsSchema();
     *
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    styledTagsSchema() {
        // This is a special case as it does not map directly to elasticsearch DSL
        // This is written this way for ease of use
        this._highlight.tags_schema = 'styled';
        return this;
    }

    /**
     * Sets the order of highlight fragments to be sorted by score. You can apply the
     * score order to a specific field by passing the optional field name parameter.
     *
     * @example
     * const highlight = esb.highlight('content').scoreOrder()
     *
     * @param {string=} field An optional field name
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    scoreOrder(field) {
        // This is a special case as it does not map directly to elasticsearch DSL
        // It is written this way for ease of use
        this._setFieldOption(field, 'order', 'score');
        return this;
    }

    /**
     * Sets the size of each highlight fragment in characters. You can apply the
     * option to a specific field by passing the optional field name parameter.
     *
     * @example
     * const highlight = esb.highlight('content')
     *     .fragmentSize(150, 'content')
     *     .numberOfFragments(3, 'content');
     *
     * @param {number} size The fragment size in characters. Defaults to 100.
     * @param {string=} field An optional field name
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    fragmentSize(size, field) {
        this._setFieldOption(field, 'fragment_size', size);
        return this;
    }
    /**
     * Sets the maximum number of fragments to return. You can apply the
     * option to a specific field by passing the optional field name parameter.
     *
     * @example
     * const highlight = esb.highlight('content')
     *     .fragmentSize(150, 'content')
     *     .numberOfFragments(3, 'content');
     *
     * @example
     * const highlight = esb.highlight(['_all', 'bio.title'])
     *     .numberOfFragments(0, 'bio.title');
     *
     * @param {number} count The maximum number of fragments to return
     * @param {string=} field An optional field name
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    numberOfFragments(count, field) {
        this._setFieldOption(field, 'number_of_fragments', count);
        return this;
    }

    /**
     * If `no_match_size` is set, in the case where there is no matching fragment
     * to highlight, a snippet of text, with the specified length, from the beginning
     * of the field will be returned.
     *
     * The actual length may be shorter than specified as it tries to break on a word boundary.
     *
     * Default is `0`.
     *
     * @example
     * const highlight = esb.highlight('content')
     *     .fragmentSize(150, 'content')
     *     .numberOfFragments(3, 'content')
     *     .noMatchSize(150, 'content');
     *
     * @param {number} size
     * @param {string} field
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    noMatchSize(size, field) {
        this._setFieldOption(field, 'no_match_size', size);
        return this;
    }

    /**
     * Highlight against a query other than the search query.
     * Useful if you use a rescore query because those
     * are not taken into account by highlighting by default.
     *
     * @example
     * const highlight = esb.highlight('content')
     *     .fragmentSize(150, 'content')
     *     .numberOfFragments(3, 'content')
     *     .highlightQuery(
     *         esb.boolQuery()
     *             .must(esb.matchQuery('content', 'foo bar'))
     *             .should(
     *                 esb.matchPhraseQuery('content', 'foo bar').slop(1).boost(10)
     *             )
     *             .minimumShouldMatch(0),
     *         'content'
     *     );
     *
     * @param {Query} query
     * @param {string=} field An optional field name
     * @returns {Highlight} returns `this` so that calls can be chained
     * @throws {TypeError} If `query` is not an instance of `Query`
     */
    highlightQuery(query, field) {
        checkType(query, Query);

        this._setFieldOption(field, 'highlight_query', query);
        return this;
    }

    /**
     * Combine matches on multiple fields to highlight a single field.
     * Useful for multifields that analyze the same string in different ways.
     * Sets the highlight type to Fast Vector Highlighter(`fvh`).
     *
     * @example
     * const highlight = esb.highlight('content')
     *     .scoreOrder('content')
     *     .matchedFields(['content', 'content.plain'], 'content');
     *
     * highlight.toJSON();
     * {
     *     "order": "score",
     *     "fields": {
     *         "content": {
     *             "matched_fields": ["content", "content.plain"],
     *             "type" : "fvh"
     *         }
     *     }
     * }
     *
     * @param {Array<string>} fields
     * @param {string} field Field name
     * @returns {Highlight} returns `this` so that calls can be chained
     * @throws {Error} field parameter should be valid field name
     * @throws {TypeError} If `fields` is not an instance of Array
     */
    matchedFields(fields, field) {
        checkType(fields, Array);
        if (isEmpty(field)) {
            throw new Error(
                '`matched_fields` requires field name to be passed'
            );
        }

        this.type('fvh', field);
        this._setFieldOption(field, 'matched_fields', fields);
        return this;
    }

    /**
     * The fast vector highlighter has a phrase_limit parameter that prevents
     * it from analyzing too many phrases and eating tons of memory. It defaults
     * to 256 so only the first 256 matching phrases in the document scored
     * considered. You can raise the limit with the phrase_limit parameter.
     *
     * If using `matched_fields`, `phrase_limit` phrases per matched field
     * are considered.
     *
     * @param {number} limit Defaults to 256.
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    phraseLimit(limit) {
        this._highlight.phrase_limit = limit;
        return this;
    }

    /**
     * Can be used to define how highlighted text will be encoded.
     *
     * @param {string} encoder It can be either default (no encoding)
     * or `html` (will escape `html`, if you use html highlighting tags)
     * @returns {Highlight} returns `this` so that calls can be chained
     * @throws {Error} Encoder can be either `default` or `html`
     */
    encoder(encoder) {
        if (isNil(encoder)) invalidEncoderParam(encoder);

        const encoderLower = encoder.toLowerCase();
        if (encoderLower !== 'default' && encoderLower !== 'html') {
            invalidEncoderParam(encoder);
        }

        this._highlight.encoder = encoderLower;
        return this;
    }

    /**
     * By default only fields that hold a query match will be highlighted.
     * This can be set to false to highlight the field regardless of whether
     * the query matched specifically on them. You can apply the
     * option to a specific field by passing the optional field name parameter.
     *
     * @example
     * const highlight = esb.highlight('_all')
     *     .preTags('<em>', '_all')
     *     .postTags('</em>', '_all')
     *     .requireFieldMatch(false);
     *
     * @param {boolean} requireFieldMatch
     * @param {string=} field An optional field name
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    requireFieldMatch(requireFieldMatch, field) {
        this._setFieldOption(field, 'require_field_match', requireFieldMatch);
        return this;
    }

    /**
     * Allows to control how far to look for boundary characters, and defaults to 20.
     * You can apply the option to a specific field by passing the optional field name parameter.
     *
     * @param {number} count The max characters to scan.
     * @param {string=} field An optional field name
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    boundaryMaxScan(count, field) {
        this._setFieldOption(field, 'boundary_max_scan', count);
        return this;
    }

    /**
     * Defines what constitutes a boundary for highlighting.
     * It is a single string with each boundary character defined in it.
     * It defaults to `.,!? \t\n`. You can apply the
     * option to a specific field by passing the optional field name parameter.
     *
     * @param {string} charStr
     * @param {string=} field An optional field name
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    boundaryChars(charStr, field) {
        this._setFieldOption(field, 'boundary_chars', charStr);
        return this;
    }

    /**
     * Allows to force a specific highlighter type.
     * This is useful for instance when needing to use
     * the plain highlighter on a field that has term_vectors enabled.
     * You can apply the option to a specific field by passing the optional
     * field name parameter.
     *
     * Note: The `postings` highlighter has been removed in elasticsearch 6.0.
     * The `unified` highlighter outputs the same highlighting when
     * `index_options` is set to `offsets`.
     *
     * @example
     * const highlight = esb.highlight('content').type('plain', 'content');
     *
     * @param {string} type The allowed values are: `plain`, `postings` and `fvh`.
     * @param {string=} field An optional field name
     * @returns {Highlight} returns `this` so that calls can be chained
     * @throws {Error} Type can be one of `plain`, `postings` or `fvh`.
     */
    type(type, field) {
        if (isNil(type)) invalidTypeParam(type);

        const typeLower = type.toLowerCase();
        if (
            typeLower !== 'plain' &&
            typeLower !== 'postings' &&
            typeLower !== 'fvh'
        ) {
            invalidTypeParam(type);
        }

        this._setFieldOption(field, 'type', typeLower);
        return this;
    }

    /**
     * Forces the highlighting to highlight fields based on the source
     * even if fields are stored separately. Defaults to false.
     *
     * @example
     * const highlight = esb.highlight('content').forceSource(true, 'content');
     *
     * @param {boolean} forceSource
     * @param {string=} field An optional field name
     * @returns {Highlight} returns `this` so that calls can be chained
     */
    forceSource(forceSource, field) {
        this._setFieldOption(field, 'force_source', forceSource);
        return this;
    }

    /**
     * Sets the fragmenter type. You can apply the
     * option to a specific field by passing the optional field name parameter.
     * Valid values for order are:
     *  - `simple` - breaks text up into same-size fragments with no concerns
     *      over spotting sentence boundaries.
     *  - `span` - breaks text up into same-size fragments but does not split
     *      up Spans.
     *
     * @example
     * const highlight = esb.highlight('message')
     *     .fragmentSize(15, 'message')
     *     .numberOfFragments(3, 'message')
     *     .fragmenter('simple', 'message');
     *
     * @param {string} fragmenter The fragmenter.
     * @param {string=} field An optional field name
     * @returns {Highlight} returns `this` so that calls can be chained
     * @throws {Error} Fragmenter can be either `simple` or `span`
     */
    fragmenter(fragmenter, field) {
        if (isNil(fragmenter)) invalidFragmenterParam(fragmenter);

        const fragmenterLower = fragmenter.toLowerCase();
        if (fragmenterLower !== 'simple' && fragmenterLower !== 'span') {
            invalidFragmenterParam(fragmenter);
        }

        this._setFieldOption(field, 'fragmenter', fragmenterLower);
        return this;
    }

    // TODO: Support Explicit field order
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-highlighting.html#explicit-field-order

    /**
     * Override default `toJSON` to return DSL representation for the `highlight` request
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        return recursiveToJSON(this._highlight);
    }
}

module.exports = Highlight;

},{"./query":87,"./util":95,"lodash.has":179,"lodash.isempty":182,"lodash.isnil":183,"lodash.isstring":185}],82:[function(require,module,exports){
'use strict';

// Base classes

exports.RequestBodySearch = require('./request-body-search');

exports.Aggregation = require('./aggregation');

exports.Query = require('./query');

exports.KNN = require('./knn');

exports.Suggester = require('./suggester');

exports.Script = require('./script');

exports.Highlight = require('./highlight');

exports.GeoPoint = require('./geo-point');

exports.GeoShape = require('./geo-shape');

exports.IndexedShape = require('./indexed-shape');

exports.Sort = require('./sort');

exports.Rescore = require('./rescore');

exports.InnerHits = require('./inner-hits');

exports.SearchTemplate = require('./search-template');

exports.consts = require('./consts');

exports.util = require('./util');

exports.RuntimeField = require('./runtime-field');

},{"./aggregation":77,"./consts":78,"./geo-point":79,"./geo-shape":80,"./highlight":81,"./indexed-shape":83,"./inner-hits":84,"./knn":86,"./query":87,"./request-body-search":88,"./rescore":89,"./runtime-field":90,"./script":91,"./search-template":92,"./sort":93,"./suggester":94,"./util":95}],83:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

/**
 * A shape which has already been indexed in another index and/or index
 * type. This is particularly useful for when you have a pre-defined list of
 * shapes which are useful to your application and you want to reference this
 * using a logical name (for example 'New Zealand') rather than having to
 * provide their coordinates each time.
 *
 * @example
 * const shape = esb.indexedShape('DEU', 'countries')
 *     .index('shapes')
 *     .path('location');
 *
 * const shape = esb.indexedShape()
 *     .id('DEU')
 *     .type('countries')
 *     .index('shapes')
 *     .path('location');
 *
 * @param {string=} id The document id of the shape.
 * @param {string=} type The name of the type where the shape is indexed.
 */
class IndexedShape {
    // eslint-disable-next-line require-jsdoc
    constructor(id, type) {
        this._body = {};

        if (!isNil(id)) this._body.id = id;
        if (!isNil(type)) this._body.type = type;
    }

    /**
     * Sets the ID of the document that containing the pre-indexed shape.
     *
     * @param {string} id The document id of the shape.
     * @returns {IndexedShape} returns `this` so that calls can be chained.
     */
    id(id) {
        this._body.id = id;
        return this;
    }

    /**
     * Sets the index type where the pre-indexed shape is.
     *
     * @param {string} type The name of the type where the shape is indexed.
     * @returns {IndexedShape} returns `this` so that calls can be chained.
     */
    type(type) {
        this._body.type = type;
        return this;
    }

    /**
     * Sets the name of the index where the pre-indexed shape is. Defaults to `shapes`.
     *
     * @param {string} index A valid index name
     * @returns {IndexedShape} returns `this` so that calls can be chained.
     */
    index(index) {
        this._body.index = index;
        return this;
    }

    /**
     * Sets the field specified as path containing the pre-indexed shape.
     * Defaults to `shape`.
     *
     * @param {string} path field name.
     * @returns {IndexedShape} returns `this` so that calls can be chained.
     */
    path(path) {
        this._body.path = path;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation of the geo shape
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        return this._body;
    }
}

module.exports = IndexedShape;

},{"lodash.isnil":183}],84:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const Sort = require('./sort');
const Highlight = require('./highlight');

const { checkType, setDefault, recursiveToJSON } = require('./util');

/**
 * Inner hits returns per search hit in the search response additional
 * nested hits that caused a search hit to match in a different scope.
 * Inner hits can be used by defining an `inner_hits` definition on a
 * `nested`, `has_child` or `has_parent` query and filter.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-inner-hits.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch().query(
 *     esb.nestedQuery(
 *         esb.matchQuery('comments.message', '[actual query]')
 *     ).innerHits(
 *         esb.innerHits().source(false).storedFields(['comments.text'])
 *     )
 * );
 *
 * @param {string=} name The name to be used for the particular inner hit definition
 * in the response. Useful when multiple inner hits have been defined in a single
 * search request. The default depends in which query the inner hit is defined.
 */
class InnerHits {
    // eslint-disable-next-line require-jsdoc
    constructor(name) {
        // Maybe accept some optional parameter?
        this._body = {};

        if (!isNil(name)) this._body.name = name;
    }

    /**
     * The name to be used for the particular inner hit definition
     * in the response. Useful when multiple inner hits have been defined in a single
     * search request. The default depends in which query the inner hit is defined.
     *
     * @param {number} name
     * @returns {InnerHits} returns `this` so that calls can be chained.
     */
    name(name) {
        this._body.name = name;
        return this;
    }

    /**
     * The offset from where the first hit to fetch for each `inner_hits` in the returned
     * regular search hits.
     *
     * @param {number} from
     * @returns {InnerHits} returns `this` so that calls can be chained.
     */
    from(from) {
        this._body.from = from;
        return this;
    }

    /**
     * The maximum number of hits to return per inner_hits.
     * By default the top three matching hits are returned.
     *
     * @param {number} size Defaults to 10.
     * @returns {InnerHits} returns `this` so that calls can be chained.
     */
    size(size) {
        this._body.size = size;
        return this;
    }

    /**
     * How the inner hits should be sorted per inner_hits.
     * By default the hits are sorted by the score.
     *
     * @param {Sort} sort
     * @returns {InnerHits} returns `this` so that calls can be chained.
     * @throws {TypeError} If parameter `sort` is not an instance of `Sort`.
     */
    sort(sort) {
        checkType(sort, Sort);
        setDefault(this._body, 'sort', []);

        this._body.sort.push(sort);
        return this;
    }

    /**
     * Allows to add multiple sort on specific fields. Each sort can be reversed as well.
     * The sort is defined on a per field level, with special field name for _score to
     * sort by score, and _doc to sort by index order.
     *
     * @param {Array<Sort>} sorts Array of sort
     * @returns {InnerHits} returns `this` so that calls can be chained.
     * @throws {TypeError} If any item in parameter `sorts` is not an instance of `Sort`.
     */
    sorts(sorts) {
        sorts.forEach(sort => this.sort(sort));
        return this;
    }

    /**
     * Allows to highlight search results on one or more fields. The implementation
     * uses either the lucene `plain` highlighter, the fast vector highlighter (`fvh`)
     * or `postings` highlighter.
     *
     * Note: The `postings` highlighter has been removed in elasticsearch 6.0.
     * The `unified` highlighter outputs the same highlighting when
     * `index_options` is set to `offsets`.
     *
     * @param {Highlight} highlight
     * @returns {InnerHits} returns `this` so that calls can be chained
     */
    highlight(highlight) {
        checkType(highlight, Highlight);

        this._body.highlight = highlight;
        return this;
    }

    /**
     * Enables explanation for each hit on how its score was computed.
     *
     * @param {boolean} enable
     * @returns {InnerHits} returns `this` so that calls can be chained
     */
    explain(enable) {
        this._body.explain = enable;
        return this;
    }

    /**
     * Allows to control how the `_source` field is returned with every hit.
     * You can turn off `_source` retrieval by passing `false`.
     * It also accepts one(string) or more wildcard(array) patterns to control
     * what parts of the `_source` should be returned
     * An object can also be used to specify the wildcard patterns for `includes` and `excludes`.
     *
     * @param {boolean|string|Array|Object} source
     * @returns {InnerHits} returns `this` so that calls can be chained
     */
    source(source) {
        this._body._source = source;
        return this;
    }

    /**
     * Include specific stored fields
     *
     * @param {Array|string} fields
     * @returns {InnerHits} returns `this` so that calls can be chained
     */
    storedFields(fields) {
        this._body.stored_fields = fields;
        return this;
    }

    /**
     * Computes a document property dynamically based on the supplied `Script`.
     *
     * @param {string} scriptFieldName
     * @param {string|Script} script string or instance of `Script`
     * @returns {InnerHits} returns `this` so that calls can be chained
     */
    scriptField(scriptFieldName, script) {
        setDefault(this._body, 'script_fields', {});

        this._body.script_fields[scriptFieldName] = { script };
        return this;
    }

    /**
     * Sets given dynamic document properties to be computed using supplied `Script`s.
     *
     * Object should have `scriptFieldName` as key and `script` as the value.
     *
     * @param {Object} scriptFields Object with `scriptFieldName` as key and `script` as the value.
     * @returns {InnerHits} returns `this` so that calls can be chained
     */
    scriptFields(scriptFields) {
        checkType(scriptFields, Object);

        Object.keys(scriptFields).forEach(scriptFieldName =>
            this.scriptField(scriptFieldName, scriptFields[scriptFieldName])
        );

        return this;
    }

    /**
     * Allows to return the doc value representation of a field for each hit.
     * Doc value fields can work on fields that are not stored.
     *
     * @param {Array<string>} fields
     * @returns {InnerHits} returns `this` so that calls can be chained
     */
    docvalueFields(fields) {
        this._body.docvalue_fields = fields;
        return this;
    }

    /**
     * Returns a version for each search hit.
     *
     * @param {boolean} enable
     * @returns {InnerHits} returns `this` so that calls can be chained.
     */
    version(enable) {
        this._body.version = enable;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for the inner hits request
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        return recursiveToJSON(this._body);
    }
}

module.exports = InnerHits;

},{"./highlight":81,"./sort":93,"./util":95,"lodash.isnil":183}],85:[function(require,module,exports){
/* istanbul ignore file */
/* eslint-disable max-lines */
'use strict';

const isString = require('lodash.isstring'),
    isObject = require('lodash.isobject');

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 * @returns {string}
 */
function inspect(obj, opts) {
    /* eslint-disable prefer-rest-params */
    // default options
    const ctx = {
        seen: [],
        stylize: stylizeNoColor
    };
    // legacy...
    if (arguments.length >= 3) ctx.depth = arguments[2];
    if (arguments.length >= 4) ctx.colors = arguments[3];
    if (isBoolean(opts)) {
        // legacy...
        ctx.showHidden = opts;
    } else if (opts) {
        // got an "options" object
        exports._extend(ctx, opts);
    }
    // set default options
    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
    if (isUndefined(ctx.depth)) ctx.depth = 2;
    if (isUndefined(ctx.colors)) ctx.colors = false;
    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
    if (ctx.colors) ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
    /* eslint-enable prefer-rest-params */
}

module.exports = inspect;

/* eslint-disable require-jsdoc */

function stylizeNoColor(str) {
    return str;
}

function stylizeWithColor(str, styleType) {
    const style = inspect.styles[styleType];

    if (style) {
        return `\u001B[${inspect.colors[style][0]}m${str}\u001B[${inspect.colors[style][1]}m`;
    }
    return str;
}

// eslint-disable-next-line complexity, max-statements
function formatValue(ctx, value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (
        ctx.customInspect &&
        value &&
        isFunction(value.inspect) &&
        // Filter out the util module, it's inspect function is special
        value.inspect !== exports.inspect &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)
    ) {
        let ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
    }

    // Primitive types cannot have properties
    const primitive = formatPrimitive(ctx, value);
    if (primitive) {
        return primitive;
    }

    // Look up the keys of the object.
    let keys = Object.keys(value);
    const visibleKeys = arrayToHash(keys);

    if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
    }

    // IE doesn't make error fields non-enumerable
    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
    if (
        isError(value) &&
        (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)
    ) {
        return formatError(value);
    }

    // Some type of object without properties can be shortcutted.
    if (keys.length === 0) {
        if (isFunction(value)) {
            const name = value.name ? `: ${value.name}` : '';
            return ctx.stylize(`[Function${name}]`, 'special');
        }
        if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        }
        if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), 'date');
        }
        if (isError(value)) {
            return formatError(value);
        }
    }

    let base = '',
        array = false,
        braces = ['{', '}'];

    // Make Array say that they are Array
    if (isArray(value)) {
        array = true;
        braces = ['[', ']'];
    }

    // Make functions say that they are functions
    if (isFunction(value)) {
        const n = value.name ? `: ${value.name}` : '';
        base = ` [Function${n}]`;
    }

    // Make RegExps say that they are RegExps
    if (isRegExp(value)) {
        base = ` ${RegExp.prototype.toString.call(value)}`;
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
        base = ` ${Date.prototype.toUTCString.call(value)}`;
    }

    // Make error with message first say the error
    if (isError(value)) {
        base = ` ${formatError(value)}`;
    }

    if (keys.length === 0 && (!array || value.length === 0)) {
        return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
        if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        }
        return ctx.stylize('[Object]', 'special');
    }

    ctx.seen.push(value);

    let output;
    if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
    } else {
        output = keys.map(key =>
            formatProperty(ctx, value, recurseTimes, visibleKeys, key, array)
        );
    }

    ctx.seen.pop();

    return reduceToSingleString(output, base, braces);
}

function isArray(ar) {
    return Array.isArray(ar);
}

function isBoolean(arg) {
    return typeof arg === 'boolean';
}

function isNull(arg) {
    return arg === null;
}

function isNumber(arg) {
    return typeof arg === 'number';
}

function isUndefined(arg) {
    return arg === undefined;
}

function isRegExp(re) {
    return isObject(re) && objectToString(re) === '[object RegExp]';
}

function isDate(d) {
    return isObject(d) && objectToString(d) === '[object Date]';
}

function isError(e) {
    return (
        isObject(e) &&
        (objectToString(e) === '[object Error]' || e instanceof Error)
    );
}

function isFunction(arg) {
    return typeof arg === 'function';
}

function arrayToHash(array) {
    const hash = {};

    array.forEach(val => {
        hash[val] = true;
    });

    return hash;
}

function formatError(value) {
    return `[${Error.prototype.toString.call(value)}]`;
}

// eslint-disable-next-line consistent-return
function formatPrimitive(ctx, value) {
    if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
    if (isString(value)) {
        const simple = `'${JSON.stringify(value)
            .replace(/^"|"$/g, '')
            .replace(/'/g, "\\'")
            .replace(/\\"/g, '"')}'`;
        return ctx.stylize(simple, 'string');
    }
    if (isNumber(value)) return ctx.stylize(`${value}`, 'number');
    if (isBoolean(value)) return ctx.stylize(`${value}`, 'boolean');
    // For some reason typeof null is "object", so special case here.
    if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    const output = [];
    for (let i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
            output.push(
                formatProperty(
                    ctx,
                    value,
                    recurseTimes,
                    visibleKeys,
                    String(i),
                    true
                )
            );
        } else {
            output.push('');
        }
    }
    keys.forEach(key => {
        if (!key.match(/^\d+$/)) {
            output.push(
                formatProperty(ctx, value, recurseTimes, visibleKeys, key, true)
            );
        }
    });
    return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    let name, str;
    const desc = Object.getOwnPropertyDescriptor(value, key) || {
        value: value[key]
    };
    if (desc.get) {
        if (desc.set) {
            str = ctx.stylize('[Getter/Setter]', 'special');
        } else {
            str = ctx.stylize('[Getter]', 'special');
        }
    } else if (desc.set) {
        str = ctx.stylize('[Setter]', 'special');
    }
    if (!hasOwnProperty(visibleKeys, key)) {
        name = `[${key}]`;
    }
    if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
                str = formatValue(ctx, desc.value, null);
            } else {
                str = formatValue(ctx, desc.value, recurseTimes - 1);
            }
            if (str.indexOf('\n') > -1) {
                if (array) {
                    str = str
                        .split('\n')
                        .map(line => `  ${line}`)
                        .join('\n')
                        .slice(2);
                } else {
                    str = `\n${str
                        .split('\n')
                        .map(line => `   ${line}`)
                        .join('\n')}`;
                }
            }
        } else {
            str = ctx.stylize('[Circular]', 'special');
        }
    }
    if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
            return str;
        }
        name = JSON.stringify(`${key}`);
        if (name.match(/^"([a-zA-Z_]\w*)"$/)) {
            name = name.slice(1, -1);
            name = ctx.stylize(name, 'name');
        } else {
            name = name
                .replace(/'/g, "\\'")
                .replace(/\\"/g, '"')
                .replace(/(^"|"$)/g, "'");
            name = ctx.stylize(name, 'string');
        }
    }

    return `${name}: ${str}`;
}

function reduceToSingleString(output, base, braces) {
    const length = output.reduce(
        (prev, cur) =>
            // eslint-disable-next-line no-control-regex
            prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1,
        0
    );

    if (length > 60) {
        return `${braces[0] + (base === '' ? '' : `${base}\n `)} ${output.join(
            ',\n  '
        )} ${braces[1]}`;
    }

    return `${braces[0] + base} ${output.join(', ')} ${braces[1]}`;
}

function objectToString(o) {
    return Object.prototype.toString.call(o);
}

/* eslint-enable require-jsdoc */

},{"lodash.isobject":184,"lodash.isstring":185}],86:[function(require,module,exports){
'use strict';

const { recursiveToJSON, checkType } = require('./util');
const Query = require('./query');

/**
 * Class representing a k-Nearest Neighbors (k-NN) query.
 * This class extends the Query class to support the specifics of k-NN search, including setting up the field,
 * query vector, number of neighbors (k), and number of candidates.
 *
 * @example
 * const qry = esb.kNN('my_field', 100, 1000).vector([1,2,3]);
 * const qry = esb.kNN('my_field', 100, 1000).queryVectorBuilder('model_123', 'Sample model text');
 *
 * NOTE: kNN search was added to Elasticsearch in v8.0
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html)
 */
class KNN {
    // eslint-disable-next-line require-jsdoc
    constructor(field, k, numCandidates) {
        if (k > numCandidates)
            throw new Error('KNN numCandidates cannot be less than k');
        this._body = {};
        this._body.field = field;
        this._body.k = k;
        this._body.filter = [];
        this._body.num_candidates = numCandidates;
    }

    /**
     * Sets the query vector for the k-NN search.
     * @param {Array<number>} vector - The query vector.
     * @returns {KNN} Returns the instance of KNN for method chaining.
     */
    queryVector(vector) {
        if (this._body.query_vector_builder)
            throw new Error(
                'cannot provide both query_vector_builder and query_vector'
            );
        this._body.query_vector = vector;
        return this;
    }

    /**
     * Sets the query vector builder for the k-NN search.
     * This method configures a query vector builder using a specified model ID and model text.
     * It's important to note that either a direct query vector or a query vector builder can be
     * provided, but not both.
     *
     * @param {string} modelId - The ID of the model to be used for generating the query vector.
     * @param {string} modelText - The text input based on which the query vector is generated.
     * @returns {KNN} Returns the instance of KNN for method chaining.
     * @throws {Error} Throws an error if both query_vector_builder and query_vector are provided.
     *
     * @example
     * let knn = new esb.KNN().queryVectorBuilder('model_123', 'Sample model text');
     */
    queryVectorBuilder(modelId, modelText) {
        if (this._body.query_vector)
            throw new Error(
                'cannot provide both query_vector_builder and query_vector'
            );
        this._body.query_vector_builder = {
            text_embeddings: {
                model_id: modelId,
                model_text: modelText
            }
        };
        return this;
    }

    /**
     * Adds one or more filter queries to the k-NN search.
     *
     * This method is designed to apply filters to the k-NN search. It accepts either a single
     * query or an array of queries. Each query acts as a filter, refining the search results
     * according to the specified conditions. These queries must be instances of the `Query` class.
     * If any provided query is not an instance of `Query`, a TypeError is thrown.
     *
     * @param {Query|Query[]} queries - A single `Query` instance or an array of `Query` instances for filtering.
     * @returns {KNN} Returns `this` to allow method chaining.
     * @throws {TypeError} If any of the provided queries is not an instance of `Query`.
     *
     * @example
     * let knn = new esb.KNN().filter(new esb.TermQuery('field', 'value')); // Applying a single filter query
     *
     * @example
     * let knn = new esb.KNN().filter([
     *     new esb.TermQuery('field1', 'value1'),
     *     new esb.TermQuery('field2', 'value2')
     * ]); // Applying multiple filter queries
     */
    filter(queries) {
        const queryArray = Array.isArray(queries) ? queries : [queries];
        queryArray.forEach(query => {
            checkType(query, Query);
            this._body.filter.push(query);
        });
        return this;
    }

    /**
     * Sets the field to perform the k-NN search on.
     * @param {number} boost - The number of the boost
     * @returns {KNN} Returns the instance of KNN for method chaining.
     */
    boost(boost) {
        this._body.boost = boost;
        return this;
    }

    /**
     * Sets the field to perform the k-NN search on.
     * @param {number} similarity - The number of the similarity
     * @returns {KNN} Returns the instance of KNN for method chaining.
     */
    similarity(similarity) {
        this._body.similarity = similarity;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for the `query`
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        if (!this._body.query_vector && !this._body.query_vector_builder)
            throw new Error(
                'either query_vector_builder or query_vector must be provided'
            );
        return recursiveToJSON(this._body);
    }
}

module.exports = KNN;

},{"./query":87,"./util":95}],87:[function(require,module,exports){
'use strict';

const { recursiveToJSON } = require('./util');

/**
 * Base class implementation for all query types.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class should be extended and used, as validation against the class
 * type is present in various places.
 *
 * @param {string} queryType
 */
class Query {
    // eslint-disable-next-line require-jsdoc
    constructor(queryType) {
        this.queryType = queryType;

        this._body = {};
        this._queryOpts = this._body[queryType] = {};
    }

    /**
     * Sets the boost value for documents matching the `Query`.
     *
     * @param {number} factor
     * @returns {Query} returns `this` so that calls can be chained.
     */
    boost(factor) {
        this._queryOpts.boost = factor;
        return this;
    }

    /**
     * Sets the query name.
     *
     * @example
     * const boolQry = esb.boolQuery()
     *     .should([
     *         esb.matchQuery('name.first', 'shay').name('first'),
     *         esb.matchQuery('name.last', 'banon').name('last')
     *     ])
     *     .filter(esb.termsQuery('name.last', ['banon', 'kimchy']).name('test'));
     *
     * @param {string} name
     * @returns {Query} returns `this` so that calls can be chained.
     */
    name(name) {
        this._queryOpts._name = name;
        return this;
    }

    /**
     * Build and returns DSL representation of the `Query` class instance.
     *
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    getDSL() {
        return this.toJSON();
    }

    /**
     * Override default `toJSON` to return DSL representation for the `query`
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        return recursiveToJSON(this._body);
    }
}

module.exports = Query;

},{"./util":95}],88:[function(require,module,exports){
'use strict';

const has = require('lodash.has'),
    isNil = require('lodash.isnil'),
    isEmpty = require('lodash.isempty');

const Query = require('./query'),
    Aggregation = require('./aggregation'),
    Suggester = require('./suggester'),
    Rescore = require('./rescore'),
    Sort = require('./sort'),
    Highlight = require('./highlight'),
    InnerHits = require('./inner-hits'),
    KNN = require('./knn');

const { checkType, setDefault, recursiveToJSON } = require('./util');
const RuntimeField = require('./runtime-field');

/**
 * Helper function to call `recursiveToJSON` on elements of array and assign to object.
 *
 * @private
 *
 * @param {Array} arr
 * @returns {Object}
 */
function recMerge(arr) {
    return Object.assign({}, ...recursiveToJSON(arr));
}

/**
 * The `RequestBodySearch` object provides methods generating an elasticsearch
 * search request body. The search request can be executed with a search DSL,
 * which includes the Query DSL, within its body.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.termQuery('user', 'kimchy'))
 *     .from(0)
 *     .size(10);
 *
 * reqBody.toJSON();
 * {
 *   "query": { "term": { "user": "kimchy" } },
 *   "from": 0,
 *   "size": 10
 * }
 *
 * @example
 * // Query and aggregation
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.matchQuery('business_type', 'shop'))
 *     .agg(
 *         esb.geoBoundsAggregation('viewport', 'location').wrapLongitude(true)
 *     );
 *
 * @example
 * // Query, aggregation with nested
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.matchQuery('crime', 'burglary'))
 *     .agg(
 *         esb.termsAggregation('towns', 'town').agg(
 *             esb.geoCentroidAggregation('centroid', 'location')
 *         )
 *     );
 */
class RequestBodySearch {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        // Maybe accept some optional parameter?
        this._body = {};
        this._knn = [];
        this._aggs = [];
        this._suggests = [];
        this._suggestText = null;
    }

    /**
     * Define query on the search request body using the Query DSL.
     *
     * @param {Query} query
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    query(query) {
        checkType(query, Query);

        this._body.query = query;
        return this;
    }

    /**
     * Sets knn on the search request body.
     *
     * @param {Knn|Knn[]} knn
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    kNN(knn) {
        const knns = Array.isArray(knn) ? knn : [knn];
        knns.forEach(_knn => {
            checkType(_knn, KNN);
            this._knn.push(_knn);
        });
        return this;
    }

    /**
     * Sets aggregation on the request body.
     * Alias for method `aggregation`
     *
     * @param {Aggregation} agg Any valid `Aggregation`
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     * @throws {TypeError} If `agg` is not an instance of `Aggregation`
     */
    agg(agg) {
        return this.aggregation(agg);
    }

    /**
     * Sets aggregation on the request body.
     *
     * @param {Aggregation} agg Any valid `Aggregation`
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     * @throws {TypeError} If `agg` is not an instance of `Aggregation`
     */
    aggregation(agg) {
        checkType(agg, Aggregation);

        this._aggs.push(agg);
        return this;
    }

    /**
     * Sets multiple nested aggregation items.
     * Alias for method `aggregations`
     *
     * @param {Array<Aggregation>} aggs Array of valid {@link Aggregation} items
     * @returns {Aggregation} returns `this` so that calls can be chained.
     * @throws {TypeError} If `aggs` is not an instance of `Array`
     * @throws {TypeError} If `aggs` contains instances not of type `Aggregation`
     */
    aggs(aggs) {
        return this.aggregations(aggs);
    }

    /**
     * Sets multiple nested aggregation items.
     * This method accepts an array to set multiple nested aggregations in one call.
     *
     * @param {Array<Aggregation>} aggs Array of valid {@link Aggregation} items
     * @returns {Aggregation} returns `this` so that calls can be chained.
     * @throws {TypeError} If `aggs` is not an instance of `Array`
     * @throws {TypeError} If `aggs` contains instances not of type `Aggregation`
     */
    aggregations(aggs) {
        checkType(aggs, Array);

        aggs.forEach(agg => this.aggregation(agg));

        return this;
    }

    /**
     * Sets suggester on the request body.
     *
     * @example
     * const req = esb.requestBodySearch()
     *     .query(esb.matchQuery('message', 'trying out elasticsearch'))
     *     .suggest(
     *         esb.termSuggester(
     *             'my-suggestion',
     *             'message',
     *             'tring out Elasticsearch'
     *         )
     *     );
     *
     * @param {Suggester} suggest Any valid `Suggester`
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     * @throws {TypeError} If `suggest` is not an instance of `Suggester`
     */
    suggest(suggest) {
        checkType(suggest, Suggester);

        this._suggests.push(suggest);
        return this;
    }

    /**
     * Sets the global suggest text to avoid repetition for multiple suggestions.
     *
     * @example
     * const req = esb.requestBodySearch()
     *     .suggestText('tring out elasticsearch')
     *     .suggest(esb.termSuggester('my-suggest-1', 'message'))
     *     .suggest(esb.termSuggester('my-suggest-2', 'user'));
     *
     * @param {string} txt Global suggest text
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    suggestText(txt) {
        this._suggestText = txt;
        return this;
    }

    /**
     * Sets a search timeout, bounding the search request to be executed within
     * the specified time value and bail with the hits accumulated up to that
     * point when expired.
     *
     * @param {string} timeout Duration can be specified using
     * [time units](https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#time-units)
     * Defaults to no timeout.
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    timeout(timeout) {
        this._body.timeout = timeout;
        return this;
    }

    /**
     * To retrieve hits from a certain offset.
     *
     * @param {number} from Defaults to 0.
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    from(from) {
        this._body.from = from;
        return this;
    }

    /**
     * The number of hits to return. If you do not care about getting some hits back
     * but only about the number of matches and/or aggregations, setting the value
     * to 0 will help performance.
     *
     * @param {number} size Defaults to 10.
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    size(size) {
        this._body.size = size;
        return this;
    }

    /**
     * The maximum number of documents to collect for each shard, upon reaching which
     * the query execution will terminate early. If set, the response will have a
     * boolean field `terminated_early` to indicate whether the query execution has
     * actually terminated early.
     *
     * @param {number} numberOfDocs Maximum number of documents to collect for each shard.
     * Defaults to no limit.
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    terminateAfter(numberOfDocs) {
        this._body.terminate_after = numberOfDocs;
        return this;
    }

    /**
     * Allows to add sort on specific field. The sort can be reversed as well.
     * The sort is defined on a per field level, with special field name for `_score` to
     * sort by score, and `_doc` to sort by index order.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .sort(esb.sort('post_date', 'asc'))
     *     .sort(esb.sort('user'))
     *     .sorts([
     *         esb.sort('name', 'desc'),
     *         esb.sort('age', 'desc'),
     *         esb.sort('_score')
     *     ]);
     *
     * @param {Sort} sort
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     * @throws {TypeError} If parameter `sort` is not an instance of `Sort`.
     */
    sort(sort) {
        checkType(sort, Sort);
        setDefault(this._body, 'sort', []);

        this._body.sort.push(sort);
        return this;
    }

    /**
     * Allows to add multiple sort on specific fields. Each sort can be reversed as well.
     * The sort is defined on a per field level, with special field name for _score to
     * sort by score, and _doc to sort by index order.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .sort(esb.sort('post_date', 'asc'))
     *     .sort(esb.sort('user'))
     *     .sorts([
     *         esb.sort('name', 'desc'),
     *         esb.sort('age', 'desc'),
     *         esb.sort('_score')
     *     ]);
     *
     * @param {Array<Sort>} sorts Arry of sort
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     * @throws {TypeError} If any item in parameter `sorts` is not an instance of `Sort`.
     */
    sorts(sorts) {
        sorts.forEach(sort => this.sort(sort));
        return this;
    }

    /**
     * When sorting on a field, scores are not computed. By setting `track_scores` to true,
     * scores will still be computed and tracked.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .trackScores(true)
     *     .sorts([
     *         esb.sort('post_date', 'desc'),
     *         esb.sort('name', 'desc'),
     *         esb.sort('age', 'desc')
     *     ])
     *     .query(esb.termQuery('user', 'kimchy'));

     *
     * @param {boolean} enable
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     */
    trackScores(enable) {
        this._body.track_scores = enable;
        return this;
    }

    /**
     * The `track_total_hits` parameter allows you to control how the total number of hits
     * should be tracked. Passing `false` can increase performance in some situations.
     * (Added in elasticsearch@7)
     *
     * Pass `true`, `false`, or the upper limit (default: `10000`) of hits you want tracked.
     *
     * @param {boolean|number} enableOrLimit
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     */
    trackTotalHits(enableOrLimit) {
        this._body.track_total_hits = enableOrLimit;
        return this;
    }

    /**
     * Allows to control how the `_source` field is returned with every hit.
     * You can turn off `_source` retrieval by passing `false`.
     * It also accepts one(string) or more wildcard(array) patterns to control
     * what parts of the `_source` should be returned
     * An object can also be used to specify the wildcard patterns for `includes` and `excludes`.
     *
     * @example
     * // To disable `_source` retrieval set to `false`:
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .source(false);
     *
     * @example
     * // The `_source` also accepts one or more wildcard patterns to control what
     * // parts of the `_source` should be returned:
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .source('obj.*');
     *
     * // OR
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .source([ 'obj1.*', 'obj2.*' ]);
     *
     * @example
     * // For complete control, you can specify both `includes` and `excludes` patterns:
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .source({
     *         'includes': [ 'obj1.*', 'obj2.*' ],
     *         'excludes': [ '*.description' ]
     *     });
     *
     * @param {boolean|string|Array|Object} source
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     */
    source(source) {
        this._body._source = source;
        return this;
    }

    /**
     * The `stored_fields` parameter is about fields that are explicitly marked as stored in the mapping.
     * Selectively load specific stored fields for each document represented by a search hit
     * using array of stored fields.
     * An empty array will cause only the `_id` and `_type` for each hit to be returned.
     * To disable the stored fields (and metadata fields) entirely use: `_none_`
     *
     * @example
     * // Selectively load specific stored fields for each document
     * // represented by a search hit
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .storedFields(['user', 'postDate']);
     *
     * @example
     * // Return only the `_id` and `_type` to be returned:
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .storedFields([]);
     *
     * @example
     * // Disable the stored fields (and metadata fields) entirely
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .storedFields('_none_');
     *
     * @param {Array|string} fields
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     */
    storedFields(fields) {
        this._body.stored_fields = fields;
        return this;
    }

    /**
     * Computes a document property dynamically based on the supplied `runtimeField`.
     *
     * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/runtime-search-request.html)
     *
     * Added in Elasticsearch v7.11.0
     * [Release note](https://www.elastic.co/guide/en/elasticsearch/reference/7.11/release-notes-7.11.0.html)
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchAllQuery())
     *     .runtimeMapping(
     *       'sessionId-name',
     *       esb.runtimeField(
     *         'keyword',
     *         `emit(doc['session_id'].value + '::' + doc['name'].value)`
     *       )
     *     )
     *
     * @example
     * // runtime fields can also be used in query aggregation
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchAllQuery())
     *     .runtimeMapping(
     *       'sessionId-eventName',
     *       esb.runtimeField(
     *         'keyword',
     *         `emit(doc['session_id'].value + '::' + doc['eventName'].value)`,
     *       )
     *     )
     *     .agg(esb.cardinalityAggregation('uniqueCount', `sessionId-eventName`)),;
     *
     * @param {string} runtimeFieldName Name for the computed runtime mapping field.
     * @param {RuntimeField} runtimeField Instance of RuntimeField
     *
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     *
     */
    runtimeMapping(runtimeFieldName, runtimeField) {
        checkType(runtimeField, RuntimeField);

        setDefault(this._body, 'runtime_mappings', {});
        this._body.runtime_mappings[runtimeFieldName] = runtimeField;
        return this;
    }

    /**
     * Computes one or more document properties dynamically based on supplied `RuntimeField`s.
     *
     * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/runtime-search-request.html)
     *
     * Added in Elasticsearch v7.11.0
     * [Release note](https://www.elastic.co/guide/en/elasticsearch/reference/7.11/release-notes-7.11.0.html)
     *
     * @example
     * const fieldA = esb.runtimeField(
     *       'keyword',
     *       `emit(doc['session_id'].value + '::' + doc['name'].value)`
     * );
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchAllQuery())
     *     .runtimeMappings({
     *       'sessionId-name': fieldA,
     *     })
     *
     * @param {Object} runtimeMappings Object with `runtimeFieldName` as key and instance of `RuntimeField` as the value.
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     */
    runtimeMappings(runtimeMappings) {
        checkType(runtimeMappings, Object);

        Object.keys(runtimeMappings).forEach(runtimeFieldName =>
            this.runtimeMapping(
                runtimeFieldName,
                runtimeMappings[runtimeFieldName]
            )
        );

        return this;
    }

    /**
     * Computes a document property dynamically based on the supplied `Script`.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchAllQuery())
     *     .scriptField(
     *         'test1',
     *         esb.script('inline', "doc['my_field_name'].value * 2").lang('painless')
     *     )
     *     .scriptField(
     *         'test2',
     *         esb.script('inline', "doc['my_field_name'].value * factor")
     *             .lang('painless')
     *             .params({ factor: 2.0 })
     *     );
     *
     * @example
     * // Script fields can also access the actual `_source` document and extract
     * // specific elements to be returned from it by using `params['_source']`.
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchAllQuery())
     *     .scriptField('test1', "params['_source']['message']");
     *
     * @param {string} scriptFieldName
     * @param {string|Script} script string or instance of `Script`
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     */
    scriptField(scriptFieldName, script) {
        setDefault(this._body, 'script_fields', {});

        this._body.script_fields[scriptFieldName] = { script };
        return this;
    }

    /**
     * Sets given dynamic document properties to be computed using supplied `Script`s.
     *
     * Object should have `scriptFieldName` as key and `script` as the value.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchAllQuery())
     *     .scriptFields({
     *         test1: esb
     *             .script('inline', "doc['my_field_name'].value * 2")
     *             .lang('painless'),
     *         test2: esb
     *             .script('inline', "doc['my_field_name'].value * factor")
     *             .lang('painless')
     *             .params({ factor: 2.0 })
     *     });
     *
     * @example
     * // Script fields can also access the actual `_source` document and extract
     * // specific elements to be returned from it by using `params['_source']`.
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchAllQuery())
     *     .scriptFields({ test1: "params['_source']['message']" });
     * @param {Object} scriptFields Object with `scriptFieldName` as key and `script` as the value.
     * @returns {TopHitsAggregation} returns `this` so that calls can be chained
     */
    scriptFields(scriptFields) {
        checkType(scriptFields, Object);

        Object.keys(scriptFields).forEach(scriptFieldName =>
            this.scriptField(scriptFieldName, scriptFields[scriptFieldName])
        );

        return this;
    }

    /**
     * Allows to return the doc value representation of a field for each hit.
     * Doc value fields can work on fields that are not stored.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchAllQuery())
     *     .docvalueFields(['test1', 'test2']);
     *
     * @param {Array<string>} fields
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     */
    docvalueFields(fields) {
        this._body.docvalue_fields = fields;
        return this;
    }

    /**
     * The `post_filter` is applied to the search hits at the very end of a search request,
     * after aggregations have already been calculated.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.boolQuery().filter(esb.termQuery('brand', 'gucci')))
     *     .agg(esb.termsAggregation('colors', 'color'))
     *     .agg(
     *         esb.filterAggregation(
     *             'color_red',
     *             esb.termQuery('color', 'red')
     *         ).agg(esb.termsAggregation('models', 'model'))
     *     )
     *     .postFilter(esb.termQuery('color', 'red'));
     *
     * @param {Query} filterQuery The filter to be applied after aggregation.
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     */
    postFilter(filterQuery) {
        checkType(filterQuery, Query);

        this._body.post_filter = filterQuery;
        return this;
    }

    /**
     * Allows to highlight search results on one or more fields. The implementation
     * uses either the lucene `plain` highlighter, the fast vector highlighter (`fvh`)
     * or `postings` highlighter.
     *
     * Note: The `postings` highlighter has been removed in elasticsearch 6.0.
     * The `unified` highlighter outputs the same highlighting when
     * `index_options` is set to `offsets`.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchAllQuery())
     *     .highlight(esb.highlight('content'));
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(
     *         esb.percolateQuery('query', 'doctype').document({
     *             message: 'The quick brown fox jumps over the lazy dog'
     *         })
     *     )
     *     .highlight(esb.highlight('message'));
     *
     * @param {Highlight} highlight
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     */
    highlight(highlight) {
        checkType(highlight, Highlight);

        this._body.highlight = highlight;
        return this;
    }

    /**
     * Rescoring can help to improve precision by reordering just the top (eg 100 - 500)
     * documents returned by the `query` and `post_filter` phases, using a secondary
     * (usually more costly) algorithm, instead of applying the costly algorithm to
     * all documents in the index.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchQuery('message', 'the quick brown').operator('or'))
     *     .rescore(
     *         esb.rescore(
     *             50,
     *             esb.matchPhraseQuery('message', 'the quick brown').slop(2)
     *         )
     *             .queryWeight(0.7)
     *             .rescoreQueryWeight(1.2)
     *     );
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchQuery('message', 'the quick brown').operator('or'))
     *     .rescore(
     *         esb.rescore(
     *             100,
     *             esb.matchPhraseQuery('message', 'the quick brown').slop(2)
     *         )
     *             .queryWeight(0.7)
     *             .rescoreQueryWeight(1.2)
     *     )
     *     .rescore(
     *         esb.rescore(
     *             10,
     *             esb.functionScoreQuery().function(
     *                 esb.scriptScoreFunction(
     *                     esb.script('inline', 'Math.log10(doc.likes.value + 2)')
     *                 )
     *             )
     *         ).scoreMode('multiply')
     *     );
     *
     * @param {Rescore} rescore
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     * @throws {TypeError} If `query` is not an instance of `Rescore`
     */
    rescore(rescore) {
        checkType(rescore, Rescore);

        if (has(this._body, 'rescore')) {
            if (!Array.isArray(this._body.rescore)) {
                this._body.rescore = [this._body.rescore];
            }

            this._body.rescore.push(rescore);
        } else this._body.rescore = rescore;

        return this;
    }

    // TODO: Scroll related changes
    // Maybe only slice needs to be supported.

    /**
     * Enables explanation for each hit on how its score was computed.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .explain(true);
     *
     * @param {boolean} enable
     * @returns {RequestBodySearch} returns `this` so that calls can be chained
     */
    explain(enable) {
        this._body.explain = enable;
        return this;
    }

    /**
     * Returns a version for each search hit.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .version(true);
     *
     * @param {boolean} enable
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    version(enable) {
        this._body.version = enable;
        return this;
    }

    /**
     * Allows to configure different boost level per index when searching across
     * more than one indices. This is very handy when hits coming from one index
     * matter more than hits coming from another index.
     *
     * Alias for method `indicesBoost`.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .indexBoost('alias1', 1.4)
     *     .indexBoost('index*', 1.3);
     *
     * @param {string} index Index windcard expression or alias
     * @param {number} boost
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    indexBoost(index, boost) {
        return this.indicesBoost(index, boost);
    }

    /**
     * Allows to configure different boost level per index when searching across
     * more than one indices. This is very handy when hits coming from one index
     * matter more than hits coming from another index.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .indicesBoost('alias1', 1.4)
     *     .indicesBoost('index*', 1.3);
     *
     * @param {string} index Index windcard expression or alias
     * @param {number} boost
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    indicesBoost(index, boost) {
        setDefault(this._body, 'indices_boost', []);

        this._body.indices_boost.push({
            [index]: boost
        });
        return this;
    }

    /**
     * Exclude documents which have a `_score` less than the minimum specified in `min_score`.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.termQuery('user', 'kimchy'))
     *     .minScore(0.5);
     *
     * @param {number} score
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    minScore(score) {
        this._body.min_score = score;
        return this;
    }

    /**
     * Allows to collapse search results based on field values. The collapsing
     * is done by selecting only the top sorted document per collapse key.
     *
     * The field used for collapsing must be a single valued `keyword` or `numeric`
     * field with `doc_values` activated
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchQuery('message', 'elasticsearch'))
     *     .collapse('user')
     *     .sort(esb.sort('likes'))
     *     .from(10);
     *
     * @example
     * // Expand each collapsed top hits with the `inner_hits` option:
     * const reqBody = esb.requestBodySearch()
     *     .query(esb.matchQuery('message', 'elasticsearch'))
     *     .collapse(
     *         'user',
     *         esb.innerHits('last_tweets')
     *             .size(5)
     *             .sort(esb.sort('date', 'asc')),
     *         4
     *     )
     *     .sort(esb.sort('likes'))
     *     .from(10);
     *
     * @param {string} field
     * @param {InnerHits=} innerHits Allows to expand each collapsed top hits.
     * @param {number=} maxConcurrentGroupRequests The number of concurrent
     * requests allowed to retrieve the inner_hits' per group
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     * @throws {TypeError} If `innerHits` is not an instance of `InnerHits`
     */
    collapse(field, innerHits, maxConcurrentGroupRequests) {
        const collapse = (this._body.collapse = { field });

        if (!isNil(innerHits)) {
            checkType(innerHits, InnerHits);

            collapse.inner_hits = innerHits;
            collapse.max_concurrent_group_searches = maxConcurrentGroupRequests;
        }

        return this;
    }

    /**
     * Allows to use the results from the previous page to help the retrieval
     * of the next page. The `search_after` parameter provides a live cursor.
     *
     * The parameter `from` must be set to `0` (or `-1`) when `search_after` is used.
     *
     * @example
     * const reqBody = esb.requestBodySearch()
     *     .size(10)
     *     .query(esb.matchQuery('message', 'elasticsearch'))
     *     .searchAfter(1463538857, 'tweet#654323')
     *     .sorts([esb.sort('date', 'asc'), esb.sort('_uid', 'desc')]);
     *
     * @param {Array<*>} values The `sort values` of the last document to retrieve
     * the next page of results
     * @returns {RequestBodySearch} returns `this` so that calls can be chained.
     */
    searchAfter(values) {
        this._body.search_after = values;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for the request body search
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        const dsl = recursiveToJSON(this._body);

        if (!isEmpty(this._knn))
            dsl.knn =
                this._knn.length == 1
                    ? recMerge(this._knn)
                    : this._knn.map(knn => recursiveToJSON(knn));

        if (!isEmpty(this._aggs)) dsl.aggs = recMerge(this._aggs);

        if (!isEmpty(this._suggests) || !isNil(this._suggestText)) {
            dsl.suggest = recMerge(this._suggests);

            if (!isNil(this._suggestText)) {
                dsl.suggest.text = this._suggestText;
            }
        }

        return dsl;
    }
}

module.exports = RequestBodySearch;

},{"./aggregation":77,"./highlight":81,"./inner-hits":84,"./knn":86,"./query":87,"./rescore":89,"./runtime-field":90,"./sort":93,"./suggester":94,"./util":95,"lodash.has":179,"lodash.isempty":182,"lodash.isnil":183}],89:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const Query = require('./query');
const { checkType, invalidParam, recursiveToJSON } = require('./util');
const { RESCORE_MODE_SET } = require('./consts');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-rescore.html';

const invalidScoreModeParam = invalidParam(
    ES_REF_URL,
    'score_mode',
    RESCORE_MODE_SET
);

/**
 * A `rescore` request can help to improve precision by reordering just
 * the top (eg 100 - 500) documents returned by the `query` and `post_filter`
 * phases, using a secondary (usually more costly) algorithm, instead of
 * applying the costly algorithm to all documents in the index.
 *
 * The rescore phase is not executed when sort is used.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-rescore.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.matchQuery('message', 'the quick brown').operator('or'))
 *     .rescore(
 *         esb.rescore(
 *             50,
 *             esb.matchPhraseQuery('message', 'the quick brown').slop(2)
 *         )
 *             .queryWeight(0.7)
 *             .rescoreQueryWeight(1.2)
 *     );
 *
 * @example
 * const rescore = esb.rescore(
 *     10,
 *     esb.functionScoreQuery().function(
 *         esb.scriptScoreFunction(
 *             esb.script('inline', 'Math.log10(doc.likes.value + 2)')
 *         )
 *     )
 * ).scoreMode('multiply');
 *
 * @param {number=} windowSize
 * @param {Query=} rescoreQuery
 */
class Rescore {
    // eslint-disable-next-line require-jsdoc
    constructor(windowSize, rescoreQuery) {
        this._body = {};
        this._rescoreOpts = this._body.query = {};

        if (!isNil(windowSize)) this._body.window_size = windowSize;
        if (!isNil(rescoreQuery)) this.rescoreQuery(rescoreQuery);
    }

    /**
     * The number of docs which will be examined on each shard can be controlled
     * by the window_size parameter, which defaults to `from` and `size`.
     *
     * @param {number} windowSize
     * @returns {Rescore} returns `this` so that calls can be chained.
     */
    windowSize(windowSize) {
        this._body.window_size = windowSize;
        return this;
    }

    /**
     * The query to execute on the Top-K results by the `query` and `post_filter` phases.
     *
     * @param {Query} rescoreQuery
     * @returns {Rescore} returns `this` so that calls can be chained.
     * @throws {TypeError} If `rescoreQuery` is not an instance of `Query`
     */
    rescoreQuery(rescoreQuery) {
        checkType(rescoreQuery, Query);

        this._rescoreOpts.rescore_query = rescoreQuery;
        return this;
    }

    /**
     * Control the relative importance of the original query.
     *
     * @param {number} weight Defaults to 1
     * @returns {Rescore} returns `this` so that calls can be chained.
     */
    queryWeight(weight) {
        this._rescoreOpts.query_weight = weight;
        return this;
    }

    /**
     * Control the relative importance of the rescore query.
     *
     * @param {number} weight Defaults to 1
     * @returns {Rescore} returns `this` so that calls can be chained.
     */
    rescoreQueryWeight(weight) {
        this._rescoreOpts.rescore_query_weight = weight;
        return this;
    }

    /**
     * Controls the way the scores are combined.
     *
     * @param {string} mode Can be one of `total`, `multiply`, `min`, `max`, `avg`.
     * Defaults to `total`.
     * @returns {Rescore} returns `this` so that calls can be chained.
     */
    scoreMode(mode) {
        if (isNil(mode)) invalidScoreModeParam(mode);

        const modeLower = mode.toLowerCase();
        if (!RESCORE_MODE_SET.has(modeLower)) {
            invalidScoreModeParam(mode);
        }

        this._rescoreOpts.score_mode = modeLower;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for `rescore` request
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        return recursiveToJSON(this._body);
    }
}

module.exports = Rescore;

},{"./consts":78,"./query":87,"./util":95,"lodash.isnil":183}],90:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');
const validType = [
    'boolean',
    'composite',
    'date',
    'double',
    'geo_point',
    'ip',
    'keyword',
    'long',
    'lookup'
];

/**
 * Class supporting the Elasticsearch runtime field.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/runtime.html)
 *
 * Added in Elasticsearch v7.11.0
 * [Release note](https://www.elastic.co/guide/en/elasticsearch/reference/7.11/release-notes-7.11.0.html)
 *
 * @param {string=} type One of `boolean`, `composite`, `date`, `double`, `geo_point`, `ip`, `keyword`, `long`, `lookup`.
 * @param {string=} script Source of the script.
 *
 * @example
 * const field = esb.runtimeField('keyword', `emit(doc['sessionId'].value + '::' + doc['name'].value)`);
 */
class RuntimeField {
    // eslint-disable-next-line require-jsdoc
    constructor(type, script) {
        this._body = {};
        this._isTypeSet = false;
        this._isScriptSet = false;

        if (!isNil(type)) {
            this.type(type);
        }

        if (!isNil(script)) {
            this.script(script);
        }
    }

    /**
     * Sets the source of the script.
     * @param {string} script
     * @returns {void}
     */
    script(script) {
        this._body.script = {
            source: script
        };
        this._isScriptSet = true;
    }

    /**
     * Sets the type of the runtime field.
     * @param {string} type One of `boolean`, `composite`, `date`, `double`, `geo_point`, `ip`, `keyword`, `long`, `lookup`.
     * @returns {void}
     */
    type(type) {
        const typeLower = type.toLowerCase();
        if (!validType.includes(typeLower)) {
            throw new Error(`\`type\` must be one of ${validType.join(', ')}`);
        }
        this._body.type = typeLower;
        this._isTypeSet = true;
    }

    /**
     * Override default `toJSON` to return DSL representation for the `script`.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        if (!this._isTypeSet) {
            throw new Error('`type` should be set');
        }

        if (!this._isScriptSet) {
            throw new Error('`script` should be set');
        }

        return this._body;
    }
}

module.exports = RuntimeField;

},{"lodash.isnil":183}],91:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

/**
 * Class supporting the Elasticsearch scripting API.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-scripting-using.html)
 *
 * Note: `inline` script type was deprecated in [elasticsearch v5.0](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/breaking_50_scripting.html).
 * `source` should be used instead. And similarly for `stored` scripts, type
 * `id` must be used instead. `file` scripts were removed as part of the
 * breaking changes in [elasticsearch v6.0](https://www.elastic.co/guide/en/elasticsearch/reference/6.0/breaking_60_scripting_changes.html#_file_scripts_removed)
 *
 * @param {string=} type One of `inline`, `stored`, `file`, `source`, `id`.
 * @param {string=} source Source of the script.
 * This needs to be specified if optional argument `type` is passed.
 *
 * @example
 * const script = esb.script('inline', "doc['my_field'] * multiplier")
 *     .lang('expression')
 *     .params({ multiplier: 2 });
 *
 * // cat "log(_score * 2) + my_modifier" > config/scripts/calculate-score.groovy
 * const script = esb.script()
 *     .lang('groovy')
 *     .file('calculate-score')
 *     .params({ my_modifier: 2 });
 */
class Script {
    // eslint-disable-next-line require-jsdoc
    constructor(type, source) {
        this._isTypeSet = false;
        this._body = {};

        // NOTE: Script syntax changed in elasticsearch 5.6 to use `id`/`source`
        // instead of `inline`/`source`/`file`. This needs to be handled
        // somehow.
        if (!isNil(type) && !isNil(source)) {
            const typeLower = type.toLowerCase();

            switch (typeLower) {
                case 'inline':
                    this.inline(source);
                    break;

                case 'source':
                    this.source(source);
                    break;

                case 'stored':
                    this.stored(source);
                    break;

                case 'id':
                    this.id(source);
                    break;

                case 'file':
                    this.file(source);
                    break;

                default:
                    throw new Error(
                        '`type` must be one of `inline`, `stored`, `file`'
                    );
            }
        }
    }

    /**
     * Print warning message to console namespaced by class name.
     *
     * @param {string} msg
     * @private
     */
    _warn(msg) {
        console.warn(`[Script] ${msg}`);
    }

    /**
     * Print warning messages to not mix `Script` source
     *
     * @private
     */
    _checkMixedRepr() {
        if (!this._isTypeSet) return;

        this._warn(
            'Script source(`inline`/`source`/`stored`/`id`/`file`) was already specified!'
        );
        this._warn('Overwriting.');

        delete this._body.inline;
        delete this._body.source;
        delete this._body.stored;
        delete this._body.id;
        delete this._body.file;
    }

    /**
     * Sets the type of script to be `inline` and specifies the source of the script.
     *
     * Note: This type was deprecated in elasticsearch v5.0. Use `source`
     * instead if you are using elasticsearch `>= 5.0`.
     *
     * @param {string} scriptCode
     * @returns {Script} returns `this` so that calls can be chained.
     */
    inline(scriptCode) {
        this._checkMixedRepr();

        this._body.inline = scriptCode;
        this._isTypeSet = true;
        return this;
    }

    /**
     * Sets the type of script to be `source` and specifies the source of the script.
     *
     * Note: `source` is an alias for the `inline` type which was deprecated
     * in elasticsearch v5.0. So this type is supported only in versions
     * `>= 5.0`.
     *
     * @param {string} scriptCode
     * @returns {Script} returns `this` so that calls can be chained.
     */
    source(scriptCode) {
        this._checkMixedRepr();

        this._body.source = scriptCode;
        this._isTypeSet = true;
        return this;
    }

    /**
     * Specify the `stored` script by `id` which will be retrieved from cluster state.
     *
     * Note: This type was deprecated in elasticsearch v5.0. Use `id`
     * instead if you are using elasticsearch `>= 5.0`.
     *
     * @param {string} scriptId The unique identifier for the stored script.
     * @returns {Script} returns `this` so that calls can be chained.
     */
    stored(scriptId) {
        this._checkMixedRepr();

        this._body.stored = scriptId;
        this._isTypeSet = true;
        return this;
    }

    /**
     * Specify the stored script to be used by it's `id` which will be retrieved
     * from cluster state.
     *
     * Note: `id` is an alias for the `stored` type which was deprecated in
     * elasticsearch v5.0. So this type is supported only in versions `>= 5.0`.
     *
     * @param {string} scriptId The unique identifier for the stored script.
     * @returns {Script} returns `this` so that calls can be chained.
     */
    id(scriptId) {
        this._checkMixedRepr();

        this._body.id = scriptId;
        this._isTypeSet = true;
        return this;
    }

    /**
     * Specify the `file` script by stored as a file in the scripts folder.
     *
     * Note: File scripts have been removed in elasticsearch 6.0. Instead, use
     * stored scripts.
     *
     * @param {string} fileName The name of the script stored as a file in the scripts folder.
     * For script file `config/scripts/calculate-score.groovy`,
     * `fileName` should be `calculate-score`
     * @returns {Script} returns `this` so that calls can be chained.
     */
    file(fileName) {
        this._checkMixedRepr();

        this._body.file = fileName;
        this._isTypeSet = true;
        return this;
    }

    /**
     * Specifies the language the script is written in. Defaults to `painless` but
     * may be set to any of languages listed in [Scripting](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-scripting.html).
     * The default language may be changed in the `elasticsearch.yml` config file by setting
     * `script.default_lang` to the appropriate language.
     *
     * For a `file` script,  it should correspond with the script file suffix.
     * `groovy` for `config/scripts/calculate-score.groovy`.
     *
     * Note: The Groovy, JavaScript, and Python scripting languages were
     * deprecated in elasticsearch 5.0 and removed in 6.0. Use painless instead.
     *
     * @param {string} lang The language for the script.
     * @returns {Script} returns `this` so that calls can be chained.
     */
    lang(lang) {
        this._body.lang = lang;
        return this;
    }

    /**
     * Specifies any named parameters that are passed into the script as variables.
     *
     * @param {Object} params Named parameters to be passed to script.
     * @returns {Script} returns `this` so that calls can be chained.
     */
    params(params) {
        this._body.params = params;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for the `script`.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        // recursiveToJSON doesn't seem to be needed here
        return this._body;
    }
}

module.exports = Script;

},{"lodash.isnil":183}],92:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const { recursiveToJSON } = require('./util');

/**
 * Class supporting the Elasticsearch search template API.
 *
 * The `/_search/template` endpoint allows to use the mustache language to
 * pre render search requests, before they are executed and fill existing
 * templates with template parameters.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html)
 *
 * @param {string=} type One of `inline`, `id`, `file`. `id` is also
 * aliased as `indexed`
 * @param {string|Object=} source Source of the search template.
 * This needs to be specified if optional argument `type` is passed.
 *
 * @example
 * const templ = esb.searchTemplate('inline', {
 *     query: esb.matchQuery('{{my_field}}', '{{my_value}}'),
 *     size: '{{my_size}}'
 * }).params({
 *     my_field: 'message',
 *     my_value: 'some message',
 *     my_size: 5
 * });
 *
 * @example
 * const templ = new esb.SearchTemplate(
 *     'inline',
 *     '{ "query": { "terms": {{#toJson}}statuses{{/toJson}} }}'
 * ).params({
 *     statuses: {
 *         status: ['pending', 'published']
 *     }
 * });
 *
 * @example
 * const templ = new esb.SearchTemplate(
 *     'inline',
 *     '{ "query": { "bool": { "must": {{#toJson}}clauses{{/toJson}} } } }'
 * ).params({
 *     clauses: [
 *         esb.termQuery('user', 'boo'),
 *         esb.termQuery('user', 'bar'),
 *         esb.termQuery('user', 'baz')
 *     ]
 * });
 */
class SearchTemplate {
    // eslint-disable-next-line require-jsdoc
    constructor(type, source) {
        this._isTypeSet = false;
        this._body = {};

        if (!isNil(type) && !isNil(source)) {
            const typeLower = type.toLowerCase();

            if (
                typeLower !== 'inline' &&
                typeLower !== 'id' &&
                typeLower !== 'indexed' && // alias for id
                typeLower !== 'file'
            ) {
                throw new Error(
                    '`type` must be one of `inline`, `id`, `indexed`, `file`'
                );
            }

            this[typeLower](source);
        }
    }

    /**
     * Print warning message to console namespaced by class name.
     *
     * @param {string} msg
     * @private
     */
    _warn(msg) {
        console.warn(`[SearchTemplate] ${msg}`);
    }

    /**
     * Print warning messages to not mix `SearchTemplate` source
     *
     * @private
     */
    _checkMixedRepr() {
        if (this._isTypeSet) {
            this._warn(
                'Search template source(`inline`/`id`/`file`) was already specified!'
            );
            this._warn('Overwriting.');

            delete this._body.file;
            delete this._body.id;
            delete this._body.file;
        }
    }

    /**
     * Helper method to set the type and source
     *
     * @param {string} type
     * @param {*} source
     * @returns {SearchTemplate} returns `this` so that calls can be chained.
     * @private
     */
    _setSource(type, source) {
        this._checkMixedRepr();

        this._body[type] = source;
        this._isTypeSet = true;
        return this;
    }

    /**
     * Sets the type of search template to be `inline` and specifies the
     * template with `query` and other optional fields such as `size`.
     *
     * @param {string|Object} templ Either an object or a string.
     * @returns {SearchTemplate} returns `this` so that calls can be chained.
     */
    inline(templ) {
        return this._setSource('inline', templ);
    }

    /**
     * Specify the indexed search template by `templateName` which will be
     * retrieved from cluster state.
     *
     * @param {string} templId The unique identifier for the indexed template.
     * @returns {SearchTemplate} returns `this` so that calls can be chained.
     */
    id(templId) {
        return this._setSource('id', templId);
    }

    /**
     * Specify the indexed search template by `templateName` which will be
     * retrieved from cluster state.
     *
     * Alias for `SearchTemplate.id`
     *
     * @param {string} templId The unique identifier for the indexed template.
     * @returns {SearchTemplate} returns `this` so that calls can be chained.
     */
    indexed(templId) {
        return this.id(templId);
    }

    /**
     * Specify the search template by filename stored in the scripts folder,
     * with `mustache` extension.
     *
     * @example
     * // `templId` - Name of the query template in config/scripts/, i.e.,
     * // storedTemplate.mustache.
     * const templ = new esb.SearchTemplate('file', 'storedTemplate').params({
     *     query_string: 'search for these words'
     * });
     *
     * @param {string} fileName The name of the search template stored as a file
     * in the scripts folder.
     * For file `config/scripts/storedTemplate.mustache`,
     * `fileName` should be `storedTemplate`
     * @returns {SearchTemplate} returns `this` so that calls can be chained.
     */
    file(fileName) {
        return this._setSource('file', fileName);
    }

    /**
     * Specifies any named parameters that are used to render the search template.
     *
     * @param {Object} params Named parameters to be used for rendering.
     * @returns {SearchTemplate} returns `this` so that calls can be chained.
     */
    params(params) {
        this._body.params = params;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for the Search Template.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        return recursiveToJSON(this._body);
    }
}

module.exports = SearchTemplate;

},{"./util":95,"lodash.isnil":183}],93:[function(require,module,exports){
'use strict';

const isEmpty = require('lodash.isempty');
const has = require('lodash.has');
const isNil = require('lodash.isnil');

const Query = require('./query');
const Script = require('./script');
const { checkType, invalidParam, recursiveToJSON } = require('./util');
const { SORT_MODE_SET, UNIT_SET } = require('./consts');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html';

const invalidOrderParam = invalidParam(ES_REF_URL, 'order', "'asc' or 'desc'");
const invalidModeParam = invalidParam(ES_REF_URL, 'mode', SORT_MODE_SET);
const invalidDistanceTypeParam = invalidParam(
    ES_REF_URL,
    'distance_type',
    "'plane' or 'arc'"
);
const invalidUnitParam = invalidParam(ES_REF_URL, 'unit', UNIT_SET);

/**
 * Allows creating and configuring sort on specified field.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.termQuery('user', 'kimchy'))
 *     .sort(esb.sort('post_date', 'asc'))
 *
 * @param {string=} field The field to sort on.
 * If a script is used to specify the sort order, `field` should be omitted.
 * @param {string=} order The `order` option can have the following values.
 * `asc`, `desc` to sort in ascending, descending order respectively.
 */
class Sort {
    // eslint-disable-next-line require-jsdoc
    constructor(field, order) {
        this._opts = {};
        this._geoPoint = null;
        this._script = null;

        if (!isNil(field)) this._field = field;
        if (!isNil(order)) this.order(order);
    }

    /**
     * Set order for sorting. The order defaults to `desc` when sorting on the `_score`,
     * and defaults to `asc` when sorting on anything else.
     *
     * @param {string} order The `order` option can have the following values.
     * `asc`, `desc` to sort in ascending, descending order respectively.
     * @returns {Sort} returns `this` so that calls can be chained.
     */
    order(order) {
        if (isNil(order)) invalidOrderParam(order);

        const orderLower = order.toLowerCase();
        if (orderLower !== 'asc' && orderLower !== 'desc') {
            invalidOrderParam(order);
        }

        this._opts.order = orderLower;
        return this;
    }

    /**
     * Elasticsearch supports sorting by array or multi-valued fields.
     * The `mode` option controls what array value is picked for sorting the
     * document it belongs to.
     *
     * The `mode` option can have the following values:
     *
     * - `min` - Pick the lowest value.
     * - `max` - Pick the highest value.
     * - `sum` - Use the sum of all values as sort value.
     *   Only applicable for number based array fields.
     * - `avg` - Use the average of all values as sort value.
     *   Only applicable for number based array fields.
     * - `median` - Use the median of all values as sort value.
     *   Only applicable for number based array fields.
     *
     * @example
     * const sort = esb.sort('price', 'asc').mode('avg');
     *
     * @param {string} mode One of `avg`, `min`, `max`, `sum` and `median`.
     * @returns {Sort} returns `this` so that calls can be chained.
     */
    mode(mode) {
        if (isNil(mode)) invalidModeParam(mode);

        const modeLower = mode.toLowerCase();
        if (!SORT_MODE_SET.has(modeLower)) {
            invalidModeParam(mode);
        }

        this._opts.mode = modeLower;
        return this;
    }

    /**
     * Defines on which nested object to sort. The actual sort field must be a direct
     * field inside this nested object. When sorting by nested field, this field
     * is mandatory.
     *
     * Note: This method has been deprecated in elasticsearch 6.1. From 6.1 and
     * later, use `nested` method instead.
     *
     * @example
     * const sort = esb.sort('offer.price', 'asc')
     *     .nestedPath('offer')
     *     .nestedFilter(esb.termQuery('offer.color', 'blue'));
     *
     * @param {string} path Nested object to sort on
     * @returns {Sort} returns `this` so that calls can be chained.
     */
    nestedPath(path) {
        this._opts.nested_path = path;
        return this;
    }

    /**
     * A filter that the inner objects inside the nested path should match with in order
     * for its field values to be taken into account by sorting. By default no
     * `nested_filter` is active.
     *
     * Note: This method has been deprecated in elasticsearch 6.1. From 6.1 and
     * later, use `nested` method instead.
     *
     * @example
     * const sort = esb.sort('offer.price', 'asc')
     *     .nestedPath('offer')
     *     .nestedFilter(esb.termQuery('offer.color', 'blue'));
     *
     * @param {Query} filterQuery Filter query
     * @returns {Sort} returns `this` so that calls can be chained.
     * @throws {TypeError} If filter query is not an instance of `Query`
     */
    nestedFilter(filterQuery) {
        checkType(filterQuery, Query);

        this._opts.nested_filter = filterQuery;
        return this;
    }

    /**
     * Defines on which nested object to sort and the filter that the inner objects inside
     * the nested path should match with in order for its field values to be taken into
     * account by sorting
     *
     * Note: This method is incompatible with elasticsearch 6.0 and older.
     * Use it only with elasticsearch 6.1 and later.
     *
     * @example
     * const sort = esb.sort('offer.price', 'asc')
     *     .nested({
     *          path: 'offer',
     *          filter: esb.termQuery('offer.color', 'blue')
     *      });
     *
     * @param {Object} nested Nested config that contains path and filter
     * @param {string} nested.path Nested object to sort on
     * @param {Query} nested.filter Filter query
     * @returns {Sort} returns `this` so that calls can be chained.
     * @throws {TypeError} If filter query is not an instance of `Query`
     */
    nested(nested) {
        const { filter } = nested;
        if (!isNil(filter)) checkType(filter, Query);

        this._opts.nested = nested;
        return this;
    }

    /**
     * The missing parameter specifies how docs which are missing the field should
     * be treated: The missing value can be set to `_last`, `_first`, or a custom value
     * (that will be used for missing docs as the sort value). The default is `_last`.
     *
     * @example
     * const sort = esb.sort('price').missing('_last');
     *
     * @param {string|number} value
     * @returns {Sort} returns `this` so that calls can be chained.
     */
    missing(value) {
        this._opts.missing = value;
        return this;
    }

    /**
     * By default, the search request will fail if there is no mapping associated with
     * a field. The `unmapped_type` option allows to ignore fields that have no mapping
     * and not sort by them. The value of this parameter is used to determine what sort
     * values to emit.
     *
     * @example
     * const sort = esb.sort('price').unmappedType('long');
     *
     * @param {string} type
     * @returns {Sort} returns `this` so that calls can be chained.
     */
    unmappedType(type) {
        this._opts.unmapped_type = type;
        return this;
    }

    /**
     * Sorts documents by distance of the geo point field from reference point.
     * If multiple reference points are specified, the final distance for a
     * document will then be `min`/`max`/`avg` (defined via `mode`) distance of all
     * points contained in the document to all points given in the sort request.
     *
     * @example
     * const sort = esb.sort('pin.location', 'asc')
     *     .geoDistance([-70, 40])
     *     .unit('km')
     *     .mode('min')
     *     .distanceType('arc');
     *
     * @param {GeoPoint|Object|Array|string} geoPoint Reference point or array of
     * points to calculate distance from. Can be expressed using the `GeoPoint` class,
     * `Object` with `lat`, `lon` keys, as a string either `lat,lon` or geohash
     * or as Array with GeoJSON format `[lon, lat]`
     * @returns {Sort} returns `this` so that calls can be chained.
     */
    geoDistance(geoPoint) {
        this._geoPoint = geoPoint;
        return this;
    }

    /**
     * Sets the distance calculation mode, `arc` or `plane`.
     * The `arc` calculation is the more accurate.
     * The `plane` is the faster but least accurate.
     *
     * @param {string} type
     * @returns {Sort} returns `this` so that calls can be chained
     * @throws {Error} If `type` is neither `plane` nor `arc`.
     */
    distanceType(type) {
        if (isNil(type)) invalidDistanceTypeParam(type);

        const typeLower = type.toLowerCase();
        if (typeLower !== 'plane' && typeLower !== 'arc') {
            invalidDistanceTypeParam(type);
        }

        this._opts.distance_type = typeLower;
        return this;
    }

    /**
     * Sets the distance unit.  Valid values are:
     * mi (miles), in (inches), yd (yards),
     * km (kilometers), cm (centimeters), mm (millimeters),
     * ft(feet), NM(nauticalmiles)
     *
     * @param {string} unit Distance unit, default is `m`(meters).
     * @returns {Sort} returns `this` so that calls can be chained
     * @throws {Error} If Unit is outside the accepted set.
     */
    unit(unit) {
        if (!UNIT_SET.has(unit)) {
            invalidUnitParam(unit);
        }

        this._opts.unit = unit;
        return this;
    }

    /**
     * Sorts based on custom script. When sorting on a field, scores are not computed.
     *
     * @example
     * const sort = esb.sort()
     *    .type('number')
     *    .script(
     *        esb.script('inline', "doc['field_name'].value * params.factor")
     *            .lang('painless')
     *            .params({ factor: 1.1 })
     *    )
     *    .order('asc');
     *
     * @param {Script} script
     * @returns {Sort} returns `this` so that calls can be chained
     * @throws {TypeError} If `script` is not an instance of `Script`
     */
    script(script) {
        checkType(script, Script);

        this._script = script;
        return this;
    }

    /**
     * Sets the format of the date when sorting a date field.
     *
     * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/mapping-date-format.html#built-in-date-formats)
     *
     * Note: The format argument is [supported since version 7.13](https://www.elastic.co/guide/en/elasticsearch/reference/7.13/release-notes-7.13.0.html) of ElasticSearch.
     *
     * @param {string} type
     * @returns {Sort} returns `this` so that calls can be chained
     */
    type(type) {
        this._opts.type = type;
        return this;
    }

    /**
     * Sets the format of the date when sorting a date field.
     *
     *  [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/mapping-date-format.html#built-in-date-formats)
     *
     * @param {string} fmt
     * @returns {Sort} returns `this` so that calls can be chained
     */
    format(fmt) {
        this._opts.format = fmt;
        return this;
    }

    /**
     * Reverse the sort order. Valid during sort types: field, geo distance, and script.
     *
     * @param {boolean} reverse If sort should be in reverse order.
     * @returns {Sort} returns `this` so that calls can be chained
     */
    reverse(reverse) {
        this._opts.reverse = reverse;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for `sort` parameter.
     *
     * @override
     * @returns {Object|string} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        const geoPointIsNil = isNil(this._geoPoint);
        const scriptIsNil = isNil(this._script);

        if (geoPointIsNil && scriptIsNil) {
            if (isEmpty(this._opts)) return this._field;

            if (
                Object.keys(this._opts).length === 1 &&
                has(this._opts, 'order')
            ) {
                return { [this._field]: this._opts.order };
            }
        }

        let repr;

        // Should I pick only the accepted properties here?
        if (!geoPointIsNil) {
            repr = {
                _geo_distance: Object.assign(
                    { [this._field]: this._geoPoint },
                    this._opts
                )
            };
        } else if (!scriptIsNil) {
            repr = {
                _script: Object.assign({ script: this._script }, this._opts)
            };
        } else {
            repr = { [this._field]: this._opts };
        }

        return recursiveToJSON(repr);
    }
}

module.exports = Sort;

},{"./consts":78,"./query":87,"./script":91,"./util":95,"lodash.has":179,"lodash.isempty":182,"lodash.isnil":183}],94:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const isEmpty = require('lodash.isempty');

/**
 * Base class implementation for all suggester types.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class should be extended and used, as validation against the class
 * type is present in various places.
 *
 * @param {string} suggesterType The type of suggester.
 * Can be one of `term`, `phrase`, `completion`
 * @param {string} name The name of the Suggester, an arbitrary identifier
 * @param {string=} field The field to fetch the candidate suggestions from.
 *
 * @throws {Error} if `name` is empty
 * @throws {Error} if `suggesterType` is empty
 */
class Suggester {
    // eslint-disable-next-line require-jsdoc
    constructor(suggesterType, name, field) {
        if (isEmpty(suggesterType))
            throw new Error('Suggester `suggesterType` cannot be empty');
        if (isEmpty(name)) throw new Error('Suggester `name` cannot be empty');

        this.name = name;
        this.suggesterType = suggesterType;

        this._body = {};
        this._opts = this._body[name] = {};
        this._suggestOpts = this._opts[suggesterType] = {};

        if (!isNil(field)) this._suggestOpts.field = field;
    }

    /**
     * Sets field to fetch the candidate suggestions from. This is a required option
     * that either needs to be set globally or per suggestion.
     *
     * @param {string} field a valid field name
     * @returns {Suggester} returns `this` so that calls can be chained
     */
    field(field) {
        this._suggestOpts.field = field;
        return this;
    }

    /**
     * Sets the number of suggestions to return (defaults to `5`).
     *
     * @param {number} size
     * @returns {Suggester} returns `this` so that calls can be chained.
     */
    size(size) {
        this._suggestOpts.size = size;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for the `suggester`
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch DSL
     */
    toJSON() {
        return this._body;
    }
}

module.exports = Suggester;

},{"lodash.isempty":182,"lodash.isnil":183}],95:[function(require,module,exports){
'use strict';

const isEmpty = require('lodash.isempty'),
    isNil = require('lodash.isnil'),
    isString = require('lodash.isstring'),
    isObject = require('lodash.isobject'),
    hasIn = require('lodash.hasin'),
    has = require('lodash.has');

const inspect = require('./inspect');

/**
 * Check if the object is instance of class type
 *
 * @private
 * @param {Object} instance
 * @param {Class} type
 * @throws {TypeError} Object must be an instance of class type
 */
exports.checkType = function checkType(instance, type) {
    if (!(instance instanceof type)) {
        if (isNil(instance)) {
            console.warn(
                `Was expecting instance of ${type.name} but got ${instance}!`
            );
        } else
            console.warn(
                `${inspect(instance)} is of the type ${typeof instance}`
            );

        throw new TypeError(`Argument must be an instance of ${type.name}`);
    }
};

/**
 * Wrapper for calling constructor with given parameters
 *
 * @private
 * @param {function(new:T, ...*)} Cls The class constructor.
 * @returns {function(...*): T} Wrapper of the class constructor which creates an instance of given Class
 * @template T
 */
exports.constructorWrapper = function constructorWrapper(Cls) {
    return (...args) => new Cls(...args);
};

/**
 * Check if the number is in the given range.
 * Returns `true` is number is less than or equal to min, max.
 *
 * @private
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {boolean} `true` if in range, `false` otherwise
 */
function between(num, min, max) {
    return num >= min && num <= max;
}

/**
 * Finds and returns the first position of first digit in string
 *
 * @private
 * @param {string} str
 * @returns {number} Index of first digit in string.
 * `-1` if digit is not found in string
 */
exports.firstDigitPos = function firstDigitPos(str) {
    if (isEmpty(str)) return -1;

    const len = str.length;
    for (let idx = 0; idx < len; idx++) {
        // '0'.charCodeAt(0) => 48
        // '9'.charCodeAt(0) => 57
        if (between(str.charCodeAt(idx), 48, 57)) return idx;
    }

    return -1;
};

/**
 * Convert class object to JSON by recursively calling `toJSON` on the class members.
 *
 * @private
 * @param {*} obj
 * @returns {Object} JSON representation of class.
 */
exports.recursiveToJSON = function recursiveToJSON(obj) {
    // Strings, numbers, booleans
    if (!isObject(obj)) return obj;

    // Each element in array needs to be recursively JSONified
    if (Array.isArray(obj)) return obj.map(x => recursiveToJSON(x));

    // If it is a native object, we'll not get anything different by calling toJSON
    // If it is a custom object, toJSON needs to be called
    // Custom object toJSON might return any datatype
    // So let us handle it recursively
    if (hasIn(obj, 'toJSON') && obj.constructor !== Object) {
        return recursiveToJSON(obj.toJSON());
    }

    // Custom object toJSON or native object might have values which need to be JSONified
    const json = {};
    for (const key of Object.keys(obj)) {
        json[key] = recursiveToJSON(obj[key]);
    }

    return json;
};

/**
 * Helper function for creating function which will log warning and throw error
 * on receiving invalid parameter
 *
 * @private
 * @param {string} refUrl
 * @param {string} paramName
 * @param {*} validValues
 * @returns {function}
 */
exports.invalidParam = function invalidParam(refUrl, paramName, validValues) {
    return (paramVal, referenceUrl = refUrl) => {
        referenceUrl && console.log(`See ${referenceUrl}`);
        console.warn(`Got '${paramName}' - '${paramVal}'`);

        const validValuesStr = isString(validValues)
            ? validValues
            : inspect(validValues);
        throw new Error(
            `The '${paramName}' parameter should be one of ${validValuesStr}`
        );
    };
};

/**
 * Set given default value on object if key is not present.
 *
 * @private
 * @param {Object} obj
 * @param {string} key
 * @param {*} value
 * @returns {boolean} `true` if the given object did not have `key` and `false` otherwise.
 */
exports.setDefault = function setDefault(obj, key, value) {
    const itHasNot = !has(obj, key);
    if (itHasNot) obj[key] = value;
    return itHasNot;
};

},{"./inspect":85,"lodash.has":179,"lodash.hasin":180,"lodash.isempty":182,"lodash.isnil":183,"lodash.isobject":184,"lodash.isstring":185}],96:[function(require,module,exports){
/* eslint-disable max-lines */

'use strict';

const {
    RequestBodySearch,
    Highlight,
    Script,
    GeoPoint,
    GeoShape,
    IndexedShape,
    Sort,
    Rescore,
    InnerHits,
    RuntimeField,
    SearchTemplate,
    Query,
    KNN,
    util: { constructorWrapper }
} = require('./core');

const {
    MatchAllQuery,
    MatchNoneQuery,
    fullTextQueries: {
        MatchQuery,
        MatchPhraseQuery,
        MatchPhrasePrefixQuery,
        MultiMatchQuery,
        CommonTermsQuery,
        QueryStringQuery,
        SimpleQueryStringQuery,
        CombinedFieldsQuery
    },
    termLevelQueries: {
        TermQuery,
        TermsQuery,
        TermsSetQuery,
        RangeQuery,
        ExistsQuery,
        PrefixQuery,
        WildcardQuery,
        RegexpQuery,
        FuzzyQuery,
        TypeQuery,
        IdsQuery
    },
    compoundQueries: {
        ConstantScoreQuery,
        BoolQuery,
        DisMaxQuery,
        FunctionScoreQuery,
        BoostingQuery,
        scoreFunctions: {
            ScriptScoreFunction,
            WeightScoreFunction,
            RandomScoreFunction,
            FieldValueFactorFunction,
            DecayScoreFunction
        }
    },
    joiningQueries: {
        NestedQuery,
        HasChildQuery,
        HasParentQuery,
        ParentIdQuery
    },
    geoQueries: {
        GeoShapeQuery,
        GeoBoundingBoxQuery,
        GeoDistanceQuery,
        GeoPolygonQuery
    },
    specializedQueries: {
        MoreLikeThisQuery,
        ScriptQuery,
        ScriptScoreQuery,
        PercolateQuery,
        DistanceFeatureQuery,
        RankFeatureQuery
    },
    spanQueries: {
        SpanTermQuery,
        SpanMultiTermQuery,
        SpanFirstQuery,
        SpanNearQuery,
        SpanOrQuery,
        SpanNotQuery,
        SpanContainingQuery,
        SpanWithinQuery,
        SpanFieldMaskingQuery
    }
} = require('./queries');

const {
    metricsAggregations: {
        AvgAggregation,
        CardinalityAggregation,
        ExtendedStatsAggregation,
        GeoBoundsAggregation,
        GeoCentroidAggregation,
        MaxAggregation,
        MinAggregation,
        PercentilesAggregation,
        PercentileRanksAggregation,
        ScriptedMetricAggregation,
        StatsAggregation,
        SumAggregation,
        TopHitsAggregation,
        ValueCountAggregation,
        WeightedAverageAggregation
    },
    bucketAggregations: {
        AdjacencyMatrixAggregation,
        ChildrenAggregation,
        CompositeAggregation,
        DateHistogramAggregation,
        AutoDateHistogramAggregation,
        VariableWidthHistogramAggregation,
        DateRangeAggregation,
        DiversifiedSamplerAggregation,
        FilterAggregation,
        FiltersAggregation,
        GeoDistanceAggregation,
        GeoHashGridAggregation,
        GeoHexGridAggregation,
        GeoTileGridAggregation,
        GlobalAggregation,
        HistogramAggregation,
        IpRangeAggregation,
        MissingAggregation,
        NestedAggregation,
        ParentAggregation,
        RangeAggregation,
        RareTermsAggregation,
        ReverseNestedAggregation,
        SamplerAggregation,
        SignificantTermsAggregation,
        SignificantTextAggregation,
        TermsAggregation
    },
    pipelineAggregations: {
        AvgBucketAggregation,
        DerivativeAggregation,
        MaxBucketAggregation,
        MinBucketAggregation,
        SumBucketAggregation,
        StatsBucketAggregation,
        ExtendedStatsBucketAggregation,
        PercentilesBucketAggregation,
        MovingAverageAggregation,
        MovingFunctionAggregation,
        CumulativeSumAggregation,
        BucketScriptAggregation,
        BucketSelectorAggregation,
        SerialDifferencingAggregation,
        BucketSortAggregation
    },
    matrixAggregations: { MatrixStatsAggregation }
} = require('./aggregations');

const {
    TermSuggester,
    DirectGenerator,
    PhraseSuggester,
    CompletionSuggester
} = require('./suggesters');

const recipes = require('./recipes');

exports.RequestBodySearch = RequestBodySearch;
exports.requestBodySearch = constructorWrapper(RequestBodySearch);

/* ============ ============ ============ */
/* ============== Queries =============== */
/* ============ ============ ============ */
exports.Query = Query;
exports.query = constructorWrapper(Query);

exports.MatchAllQuery = MatchAllQuery;
exports.matchAllQuery = constructorWrapper(MatchAllQuery);

exports.MatchNoneQuery = MatchNoneQuery;
exports.matchNoneQuery = constructorWrapper(MatchNoneQuery);

/* ============ ============ ============ */
/* ========== Full Text Queries ========= */
/* ============ ============ ============ */
exports.MatchQuery = MatchQuery;
exports.matchQuery = constructorWrapper(MatchQuery);

exports.MatchPhraseQuery = MatchPhraseQuery;
exports.matchPhraseQuery = constructorWrapper(MatchPhraseQuery);

exports.MatchPhrasePrefixQuery = MatchPhrasePrefixQuery;
exports.matchPhrasePrefixQuery = constructorWrapper(MatchPhrasePrefixQuery);

exports.MultiMatchQuery = MultiMatchQuery;
exports.multiMatchQuery = constructorWrapper(MultiMatchQuery);

exports.CommonTermsQuery = CommonTermsQuery;
exports.commonTermsQuery = constructorWrapper(CommonTermsQuery);

exports.QueryStringQuery = QueryStringQuery;
exports.queryStringQuery = constructorWrapper(QueryStringQuery);

exports.SimpleQueryStringQuery = SimpleQueryStringQuery;
exports.simpleQueryStringQuery = constructorWrapper(SimpleQueryStringQuery);

exports.CombinedFieldsQuery = CombinedFieldsQuery;
exports.combinedFieldsQuery = constructorWrapper(CombinedFieldsQuery);

/* ============ ============ ============ */
/* ========= Term Level Queries ========= */
/* ============ ============ ============ */
exports.TermQuery = TermQuery;
exports.termQuery = constructorWrapper(TermQuery);

exports.TermsQuery = TermsQuery;
exports.termsQuery = constructorWrapper(TermsQuery);

exports.TermsSetQuery = TermsSetQuery;
exports.termsSetQuery = constructorWrapper(TermsSetQuery);

exports.RangeQuery = RangeQuery;
exports.rangeQuery = constructorWrapper(RangeQuery);

exports.ExistsQuery = ExistsQuery;
exports.existsQuery = constructorWrapper(ExistsQuery);

exports.PrefixQuery = PrefixQuery;
exports.prefixQuery = constructorWrapper(PrefixQuery);

exports.WildcardQuery = WildcardQuery;
exports.wildcardQuery = constructorWrapper(WildcardQuery);

exports.RegexpQuery = RegexpQuery;
exports.regexpQuery = constructorWrapper(RegexpQuery);

exports.FuzzyQuery = FuzzyQuery;
exports.fuzzyQuery = constructorWrapper(FuzzyQuery);

exports.TypeQuery = TypeQuery;
exports.typeQuery = constructorWrapper(TypeQuery);

exports.IdsQuery = IdsQuery;
exports.idsQuery = constructorWrapper(IdsQuery);

/* ============ ============ ============ */
/* ========== Compound Queries ========== */
/* ============ ============ ============ */
exports.ConstantScoreQuery = ConstantScoreQuery;
exports.constantScoreQuery = constructorWrapper(ConstantScoreQuery);

exports.BoolQuery = BoolQuery;
exports.boolQuery = constructorWrapper(BoolQuery);

exports.DisMaxQuery = DisMaxQuery;
exports.disMaxQuery = constructorWrapper(DisMaxQuery);

exports.FunctionScoreQuery = FunctionScoreQuery;
exports.functionScoreQuery = constructorWrapper(FunctionScoreQuery);

exports.BoostingQuery = BoostingQuery;
exports.boostingQuery = constructorWrapper(BoostingQuery);

/* ============ ============ ============ */
/* =========== Joining Queries ========== */
/* ============ ============ ============ */
exports.NestedQuery = NestedQuery;
exports.nestedQuery = constructorWrapper(NestedQuery);

exports.HasChildQuery = HasChildQuery;
exports.hasChildQuery = constructorWrapper(HasChildQuery);

exports.HasParentQuery = HasParentQuery;
exports.hasParentQuery = constructorWrapper(HasParentQuery);

exports.ParentIdQuery = ParentIdQuery;
exports.parentIdQuery = constructorWrapper(ParentIdQuery);

/* ============ ============ ============ */
/* ============ Geo Queries ============= */
/* ============ ============ ============ */
exports.GeoShapeQuery = GeoShapeQuery;
exports.geoShapeQuery = constructorWrapper(GeoShapeQuery);

exports.GeoBoundingBoxQuery = GeoBoundingBoxQuery;
exports.geoBoundingBoxQuery = constructorWrapper(GeoBoundingBoxQuery);

exports.GeoDistanceQuery = GeoDistanceQuery;
exports.geoDistanceQuery = constructorWrapper(GeoDistanceQuery);

exports.GeoPolygonQuery = GeoPolygonQuery;
exports.geoPolygonQuery = constructorWrapper(GeoPolygonQuery);

/* ============ ============ ============ */
/* ======== Specialized Queries ========= */
/* ============ ============ ============ */
exports.MoreLikeThisQuery = MoreLikeThisQuery;
exports.moreLikeThisQuery = constructorWrapper(MoreLikeThisQuery);

exports.ScriptQuery = ScriptQuery;
exports.scriptQuery = constructorWrapper(ScriptQuery);

exports.ScriptScoreQuery = ScriptScoreQuery;
exports.scriptScoreQuery = constructorWrapper(ScriptScoreQuery);

exports.PercolateQuery = PercolateQuery;
exports.percolateQuery = constructorWrapper(PercolateQuery);

exports.DistanceFeatureQuery = DistanceFeatureQuery;
exports.distanceFeatureQuery = constructorWrapper(DistanceFeatureQuery);

exports.RankFeatureQuery = RankFeatureQuery;
exports.rankFeatureQuery = constructorWrapper(RankFeatureQuery);

/* ============ ============ ============ */
/* ============ Span Queries ============ */
/* ============ ============ ============ */
exports.SpanTermQuery = SpanTermQuery;
exports.spanTermQuery = constructorWrapper(SpanTermQuery);

exports.SpanMultiTermQuery = SpanMultiTermQuery;
exports.spanMultiTermQuery = constructorWrapper(SpanMultiTermQuery);

exports.SpanFirstQuery = SpanFirstQuery;
exports.spanFirstQuery = constructorWrapper(SpanFirstQuery);

exports.SpanNearQuery = SpanNearQuery;
exports.spanNearQuery = constructorWrapper(SpanNearQuery);

exports.SpanOrQuery = SpanOrQuery;
exports.spanOrQuery = constructorWrapper(SpanOrQuery);

exports.SpanNotQuery = SpanNotQuery;
exports.spanNotQuery = constructorWrapper(SpanNotQuery);

exports.SpanContainingQuery = SpanContainingQuery;
exports.spanContainingQuery = constructorWrapper(SpanContainingQuery);

exports.SpanWithinQuery = SpanWithinQuery;
exports.spanWithinQuery = constructorWrapper(SpanWithinQuery);

exports.SpanFieldMaskingQuery = SpanFieldMaskingQuery;
exports.spanFieldMaskingQuery = constructorWrapper(SpanFieldMaskingQuery);

/* ============ ============ ============ */
/* ======== KNN ======== */
/* ============ ============ ============ */
exports.KNN = KNN;
exports.kNN = constructorWrapper(KNN);

/* ============ ============ ============ */
/* ======== Metrics Aggregations ======== */
/* ============ ============ ============ */
exports.AvgAggregation = AvgAggregation;
exports.avgAggregation = constructorWrapper(AvgAggregation);

exports.WeightedAverageAggregation = WeightedAverageAggregation;
exports.weightedAverageAggregation = constructorWrapper(
    WeightedAverageAggregation
);

exports.CardinalityAggregation = CardinalityAggregation;
exports.cardinalityAggregation = constructorWrapper(CardinalityAggregation);

exports.ExtendedStatsAggregation = ExtendedStatsAggregation;
exports.extendedStatsAggregation = constructorWrapper(ExtendedStatsAggregation);

exports.GeoBoundsAggregation = GeoBoundsAggregation;
exports.geoBoundsAggregation = constructorWrapper(GeoBoundsAggregation);

exports.GeoCentroidAggregation = GeoCentroidAggregation;
exports.geoCentroidAggregation = constructorWrapper(GeoCentroidAggregation);

exports.MaxAggregation = MaxAggregation;
exports.maxAggregation = constructorWrapper(MaxAggregation);

exports.MinAggregation = MinAggregation;
exports.minAggregation = constructorWrapper(MinAggregation);

exports.PercentilesAggregation = PercentilesAggregation;
exports.percentilesAggregation = constructorWrapper(PercentilesAggregation);

exports.PercentileRanksAggregation = PercentileRanksAggregation;
exports.percentileRanksAggregation = constructorWrapper(
    PercentileRanksAggregation
);

exports.ScriptedMetricAggregation = ScriptedMetricAggregation;
exports.scriptedMetricAggregation = constructorWrapper(
    ScriptedMetricAggregation
);

exports.StatsAggregation = StatsAggregation;
exports.statsAggregation = constructorWrapper(StatsAggregation);

exports.SumAggregation = SumAggregation;
exports.sumAggregation = constructorWrapper(SumAggregation);

exports.TopHitsAggregation = TopHitsAggregation;
exports.topHitsAggregation = constructorWrapper(TopHitsAggregation);

exports.ValueCountAggregation = ValueCountAggregation;
exports.valueCountAggregation = constructorWrapper(ValueCountAggregation);

/* ============ ============ ============ */
/* ========= Bucket Aggregations ======== */
/* ============ ============ ============ */
exports.AdjacencyMatrixAggregation = AdjacencyMatrixAggregation;
exports.adjacencyMatrixAggregation = constructorWrapper(
    AdjacencyMatrixAggregation
);

exports.ChildrenAggregation = ChildrenAggregation;
exports.childrenAggregation = constructorWrapper(ChildrenAggregation);

exports.CompositeAggregation = CompositeAggregation;
exports.compositeAggregation = constructorWrapper(CompositeAggregation);

exports.DateHistogramAggregation = DateHistogramAggregation;
exports.dateHistogramAggregation = constructorWrapper(DateHistogramAggregation);

exports.AutoDateHistogramAggregation = AutoDateHistogramAggregation;
exports.autoDateHistogramAggregation = constructorWrapper(
    AutoDateHistogramAggregation
);

exports.VariableWidthHistogramAggregation = VariableWidthHistogramAggregation;
exports.variableWidthHistogramAggregation = constructorWrapper(
    VariableWidthHistogramAggregation
);

exports.DateRangeAggregation = DateRangeAggregation;
exports.dateRangeAggregation = constructorWrapper(DateRangeAggregation);

exports.DiversifiedSamplerAggregation = DiversifiedSamplerAggregation;
exports.diversifiedSamplerAggregation = constructorWrapper(
    DiversifiedSamplerAggregation
);

exports.FilterAggregation = FilterAggregation;
exports.filterAggregation = constructorWrapper(FilterAggregation);

exports.FiltersAggregation = FiltersAggregation;
exports.filtersAggregation = constructorWrapper(FiltersAggregation);

exports.GeoDistanceAggregation = GeoDistanceAggregation;
exports.geoDistanceAggregation = constructorWrapper(GeoDistanceAggregation);

exports.GeoHashGridAggregation = GeoHashGridAggregation;
exports.geoHashGridAggregation = constructorWrapper(GeoHashGridAggregation);

exports.GeoHexGridAggregation = GeoHexGridAggregation;
exports.geoHexGridAggregation = constructorWrapper(GeoHexGridAggregation);

exports.GeoTileGridAggregation = GeoTileGridAggregation;
exports.geoTileGridAggregation = constructorWrapper(GeoTileGridAggregation);

exports.GlobalAggregation = GlobalAggregation;
exports.globalAggregation = constructorWrapper(GlobalAggregation);

exports.HistogramAggregation = HistogramAggregation;
exports.histogramAggregation = constructorWrapper(HistogramAggregation);

exports.IpRangeAggregation = IpRangeAggregation;
exports.ipRangeAggregation = constructorWrapper(IpRangeAggregation);

exports.MissingAggregation = MissingAggregation;
exports.missingAggregation = constructorWrapper(MissingAggregation);

exports.NestedAggregation = NestedAggregation;
exports.nestedAggregation = constructorWrapper(NestedAggregation);

exports.ParentAggregation = ParentAggregation;
exports.parentAggregation = constructorWrapper(ParentAggregation);

exports.RangeAggregation = RangeAggregation;
exports.rangeAggregation = constructorWrapper(RangeAggregation);

exports.RareTermsAggregation = RareTermsAggregation;
exports.rareTermsAggregation = constructorWrapper(RareTermsAggregation);

exports.ReverseNestedAggregation = ReverseNestedAggregation;
exports.reverseNestedAggregation = constructorWrapper(ReverseNestedAggregation);

exports.SamplerAggregation = SamplerAggregation;
exports.samplerAggregation = constructorWrapper(SamplerAggregation);

exports.SignificantTermsAggregation = SignificantTermsAggregation;
exports.significantTermsAggregation = constructorWrapper(
    SignificantTermsAggregation
);

exports.SignificantTextAggregation = SignificantTextAggregation;
exports.significantTextAggregation = constructorWrapper(
    SignificantTextAggregation
);

exports.TermsAggregation = TermsAggregation;
exports.termsAggregation = constructorWrapper(TermsAggregation);

/* ============ ============ ============ */
/* ======== Pipeline Aggregations ======= */
/* ============ ============ ============ */
exports.AvgBucketAggregation = AvgBucketAggregation;
exports.avgBucketAggregation = constructorWrapper(AvgBucketAggregation);

exports.DerivativeAggregation = DerivativeAggregation;
exports.derivativeAggregation = constructorWrapper(DerivativeAggregation);

exports.MaxBucketAggregation = MaxBucketAggregation;
exports.maxBucketAggregation = constructorWrapper(MaxBucketAggregation);

exports.MinBucketAggregation = MinBucketAggregation;
exports.minBucketAggregation = constructorWrapper(MinBucketAggregation);

exports.BucketSortAggregation = BucketSortAggregation;
exports.bucketSortAggregation = constructorWrapper(BucketSortAggregation);

exports.SumBucketAggregation = SumBucketAggregation;
exports.sumBucketAggregation = constructorWrapper(SumBucketAggregation);

exports.StatsBucketAggregation = StatsBucketAggregation;
exports.statsBucketAggregation = constructorWrapper(StatsBucketAggregation);

exports.ExtendedStatsBucketAggregation = ExtendedStatsBucketAggregation;
exports.extendedStatsBucketAggregation = constructorWrapper(
    ExtendedStatsBucketAggregation
);

exports.PercentilesBucketAggregation = PercentilesBucketAggregation;
exports.percentilesBucketAggregation = constructorWrapper(
    PercentilesBucketAggregation
);

exports.MovingAverageAggregation = MovingAverageAggregation;
exports.movingAverageAggregation = constructorWrapper(MovingAverageAggregation);

exports.MovingFunctionAggregation = MovingFunctionAggregation;
exports.movingFunctionAggregation = constructorWrapper(
    MovingFunctionAggregation
);

exports.CumulativeSumAggregation = CumulativeSumAggregation;
exports.cumulativeSumAggregation = constructorWrapper(CumulativeSumAggregation);

exports.BucketScriptAggregation = BucketScriptAggregation;
exports.bucketScriptAggregation = constructorWrapper(BucketScriptAggregation);

exports.BucketSelectorAggregation = BucketSelectorAggregation;
exports.bucketSelectorAggregation = constructorWrapper(
    BucketSelectorAggregation
);

exports.SerialDifferencingAggregation = SerialDifferencingAggregation;
exports.serialDifferencingAggregation = constructorWrapper(
    SerialDifferencingAggregation
);

/* ============ ============ ============ */
/* ========= Matrix Aggregations ======== */
/* ============ ============ ============ */
exports.MatrixStatsAggregation = MatrixStatsAggregation;
exports.matrixStatsAggregation = constructorWrapper(MatrixStatsAggregation);

/* ============ ============ ============ */
/* ========== Score Functions =========== */
/* ============ ============ ============ */
exports.ScriptScoreFunction = ScriptScoreFunction;
exports.scriptScoreFunction = constructorWrapper(ScriptScoreFunction);

exports.WeightScoreFunction = WeightScoreFunction;
exports.weightScoreFunction = constructorWrapper(WeightScoreFunction);

exports.RandomScoreFunction = RandomScoreFunction;
exports.randomScoreFunction = constructorWrapper(RandomScoreFunction);

exports.FieldValueFactorFunction = FieldValueFactorFunction;
exports.fieldValueFactorFunction = constructorWrapper(FieldValueFactorFunction);

exports.DecayScoreFunction = DecayScoreFunction;
exports.decayScoreFunction = constructorWrapper(DecayScoreFunction);

/* ============ ============ ============ */
/* ============= Suggesters ============= */
/* ============ ============ ============ */

exports.TermSuggester = TermSuggester;
exports.termSuggester = constructorWrapper(TermSuggester);

exports.DirectGenerator = DirectGenerator;
exports.directGenerator = constructorWrapper(DirectGenerator);

exports.PhraseSuggester = PhraseSuggester;
exports.phraseSuggester = constructorWrapper(PhraseSuggester);

exports.CompletionSuggester = CompletionSuggester;
exports.completionSuggester = constructorWrapper(CompletionSuggester);

/* ============ ============ ============ */
/* ============== Recipes =============== */
/* ============ ============ ============ */

/**
 * Helper recipes for common query use cases.
 *
 * If you have any recipes, please do share or better yet, create a [pull request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/).
 *
 * Recipes:
 * - [`missingQuery`](/#missingquery)
 * - [`randomSortQuery`](/#randomsortquery)
 * - [`filterQuery`](/#filterquery)
 *
 * These can be accessed under the `recipes` namespace or
 * using the `cook[Recipe Name]` alias for ease of use.
 *
 * @example
 * // `recipes` namespace
 * const qry = esb.recipes.missingQuery('user');
 *
 * @example
 * // `cookMissingQuery` alias
 * const qry = esb.cookMissingQuery('user');
 */
exports.recipes = recipes;
exports.cookMissingQuery = recipes.missingQuery;
exports.cookRandomSortQuery = recipes.randomSortQuery;
exports.cookFilterQuery = recipes.filterQuery;

/* ============ ============ ============ */
/* ============ Miscellaneous =========== */
/* ============ ============ ============ */
exports.Highlight = Highlight;
exports.highlight = constructorWrapper(Highlight);

exports.Script = Script;
exports.script = constructorWrapper(Script);

exports.GeoPoint = GeoPoint;
exports.geoPoint = constructorWrapper(GeoPoint);

exports.GeoShape = GeoShape;
exports.geoShape = constructorWrapper(GeoShape);

exports.IndexedShape = IndexedShape;
exports.indexedShape = constructorWrapper(IndexedShape);

exports.Sort = Sort;
exports.sort = constructorWrapper(Sort);

exports.Rescore = Rescore;
exports.rescore = constructorWrapper(Rescore);

exports.InnerHits = InnerHits;
exports.innerHits = constructorWrapper(InnerHits);

exports.SearchTemplate = SearchTemplate;
exports.searchTemplate = constructorWrapper(SearchTemplate);

exports.RuntimeField = RuntimeField;
exports.runtimeField = constructorWrapper(RuntimeField);

exports.prettyPrint = function prettyPrint(obj) {
    console.log(JSON.stringify(obj, null, 2));
};

/* eslint-enable */

},{"./aggregations":40,"./core":82,"./queries":130,"./recipes":172,"./suggesters":176}],97:[function(require,module,exports){
'use strict';

const has = require('lodash.has');
const head = require('lodash.head');
const omit = require('lodash.omit');

const {
    Query,
    util: { checkType, setDefault, recursiveToJSON }
} = require('../../core');

/**
 * A query that matches documents matching boolean combinations of other queries.
 * The bool query maps to Lucene `BooleanQuery`. It is built using one or more
 * boolean clauses, each clause with a typed occurrence.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)
 *
 * @example
 * const qry = esb.boolQuery()
 *     .must(esb.termQuery('user', 'kimchy'))
 *     .filter(esb.termQuery('tag', 'tech'))
 *     .mustNot(esb.rangeQuery('age').gte(10).lte(20))
 *     .should([
 *         esb.termQuery('tag', 'wow'),
 *         esb.termQuery('tag', 'elasticsearch')
 *     ])
 *     .minimumShouldMatch(1)
 *     .boost(1.0);
 *
 * @extends Query
 */
class BoolQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('bool');
    }

    /**
     * Add given query to list of queries under given clause.
     *
     * @private
     * @param {string} clause
     * @param {Query} query
     * @throws {TypeError} If query is not an instance of `Query`
     */
    _addQuery(clause, query) {
        checkType(query, Query);

        this._queryOpts[clause].push(query);
    }

    /**
     * Add given query array or query to list of queries under given clause.
     *
     * @private
     * @param {string} clause
     * @param {Array<Query>|Query} queries List of valid `Query` objects or a `Query` object
     * @throws {TypeError} If Array item or query is not an instance of `Query`
     */
    _addQueries(clause, queries) {
        setDefault(this._queryOpts, clause, []);

        if (Array.isArray(queries))
            queries.forEach(qry => this._addQuery(clause, qry));
        else this._addQuery(clause, queries);
    }

    /**
     * Adds `must` query to boolean container.
     * The clause (query) **must** appear in matching documents and will contribute to the score.
     *
     * @param {Array<Query>|Query} queries List of valid `Query` objects or a `Query` object
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If Array item or query is not an instance of `Query`
     */
    must(queries) {
        this._addQueries('must', queries);
        return this;
    }

    /**
     * Adds `filter` query to boolean container.
     * The clause (query) **must** appear in matching documents. However unlike `must` the score
     * of the query will be ignored. Filter clauses are executed in filter context, meaning that
     * scoring is ignored and clauses are considered for caching.
     *
     * @example
     * // Assign score of `0` to all documents
     * const qry = esb.boolQuery().filter(esb.termQuery('status', 'active'));
     *
     * // Assign a score of `1.0` to all documents
     * const qry = esb.boolQuery()
     *     .must(esb.matchAllQuery())
     *     .filter(esb.termQuery('status', 'active'));
     *
     * @param {Array<Query>|Query} queries List of valid `Query` objects or a `Query` object
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If Array item or query is not an instance of `Query`
     */
    filter(queries) {
        this._addQueries('filter', queries);
        return this;
    }

    /**
     * Adds `must_not` query to boolean container.
     * The clause (query) **must not** appear in the matching documents.
     * Clauses are executed in filter context meaning that scoring is ignored
     * and clauses are considered for caching. Because scoring is ignored,
     * a score of 0 for all documents is returned.
     *
     * @param {Array<Query>|Query} queries List of valid `Query` objects or a `Query` object
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If Array item or query is not an instance of `Query`
     */
    mustNot(queries) {
        this._addQueries('must_not', queries);
        return this;
    }

    /**
     * Adds `should` query to boolean container.
     * The clause (query) **should** appear in the matching document. In a boolean query with
     * no must or filter clauses, one or more should clauses must match a document.
     * The minimum number of should clauses to match can be set using the
     * `minimum_should_match` parameter.
     *
     * @param {Array<Query>|Query} queries List of valid `Query` objects or a `Query` object
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If Array item or query is not an instance of `Query`
     */
    should(queries) {
        this._addQueries('should', queries);
        return this;
    }

    /**
     * Enables or disables similarity coordinate scoring of documents
     * commoning the `CommonTermsQuery`. Default: `false`.
     *
     * **NOTE**: This has been removed in elasticsearch 6.0. If provided,
     * it will be ignored and a deprecation warning will be issued.
     *
     * @param {boolean} enable
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     */
    disableCoord(enable) {
        this._queryOpts.disable_coord = enable;
        return this;
    }

    /**
     * Sets the value controlling how many `should` clauses in the boolean
     * query should match. It can be an absolute value (2), a percentage (30%)
     * or a combination of both. By default no optional clauses are necessary for a match.
     * However, if the bool query is used in a filter context and it has `should` clauses then,
     * at least one `should` clause is required to match.
     *
     * @param {string|number} minimumShouldMatch An absolute value (2), a percentage (30%)
     * or a combination of both.
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     */
    minimumShouldMatch(minimumShouldMatch) {
        this._queryOpts.minimum_should_match = minimumShouldMatch;
        return this;
    }

    /**
     * Sets if the `Query` should be enhanced with a `MatchAllQuery` in order
     * to act as a pure exclude when only negative (mustNot) clauses exist. Default: true.
     *
     * @param {boolean} enable
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     */
    adjustPureNegative(enable) {
        this._queryOpts.adjust_pure_negative = enable;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation of the `bool` compound query
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        const clauseKeys = ['must', 'filter', 'must_not', 'should'];

        // Pick the clauses which have some queries
        const cleanQryOpts = clauseKeys
            .filter(clause => has(this._queryOpts, clause))
            .reduce(
                // Unwrap array and put into qryOpts if required
                (qryOpts, clause) => {
                    const clauseQueries = this._queryOpts[clause];
                    qryOpts[clause] = recursiveToJSON(
                        clauseQueries.length === 1
                            ? head(clauseQueries)
                            : clauseQueries
                    );
                    return qryOpts;
                },
                // initial value - all key-value except clauses
                omit(this._queryOpts, clauseKeys)
            );

        return {
            [this.queryType]: cleanQryOpts
        };
    }
}

module.exports = BoolQuery;

},{"../../core":82,"lodash.has":179,"lodash.head":181,"lodash.omit":186}],98:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Query,
    util: { checkType }
} = require('../../core');

/**
 * The boosting query can be used to effectively demote results that match
 * a given query. Unlike the "NOT" clause in bool query, this still selects
 * documents that contain undesirable terms, but reduces their overall
 * score.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-boosting-query.html)
 *
 * @example
 * const qry = esb.boostingQuery(
 *     esb.termQuery('field1', 'value1'), // positiveQry
 *     esb.termQuery('field2', 'value2'), // negativeQry
 *     0.2 // negativeBoost
 * );
 *
 * @param {Query=} positiveQry A valid `Query` object.
 * @param {Query=} negativeQry A valid `Query` object.
 * @param {number=} negativeBoost A positive `double` value where `0 < n < 1`.
 *
 * @extends Query
 */
class BoostingQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(positiveQry, negativeQry, negativeBoost) {
        super('boosting');

        if (!isNil(positiveQry)) this.positive(positiveQry);
        if (!isNil(negativeQry)) this.negative(negativeQry);
        if (!isNil(negativeBoost))
            this._queryOpts.negative_boost = negativeBoost;
    }

    /**
     * Sets the "master" query that determines which results are returned.
     *
     * @param {Query} query A valid `Query` object.
     * @returns {BoostingQuery} returns `this` so that calls can be chained.
     */
    positive(query) {
        checkType(query, Query);

        this._queryOpts.positive = query;
        return this;
    }

    /**
     * Sets the query used to match documents in the `positive`
     * query that will be negatively boosted.
     *
     * @param {Query} query A valid `Query` object.
     * @returns {BoostingQuery} returns `this` so that calls can be chained.
     */
    negative(query) {
        checkType(query, Query);

        this._queryOpts.negative = query;
        return this;
    }

    /**
     * Sets the negative boost value.
     *
     * @param {number} factor A positive `double` value where `0 < n < 1`.
     * @returns {BoostingQuery} returns `this` so that calls can be chained.
     */
    negativeBoost(factor) {
        this._queryOpts.negative_boost = factor;
        return this;
    }
}

module.exports = BoostingQuery;

},{"../../core":82,"lodash.isnil":183}],99:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Query,
    util: { checkType }
} = require('../../core');

/**
 * A query that wraps another query and simply returns a constant score
 * equal to the query boost for every document in the filter.
 * Maps to Lucene `ConstantScoreQuery`.
 *
 * Constructs a query where each documents returned by the internal
 * query or filter have a constant score equal to the boost factor.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-constant-score-query.html)
 *
 * @example
 * const qry = esb.constantScoreQuery(esb.termQuery('user', 'kimchy')).boost(1.2);
 *
 * @param {Query=} filterQuery Query to filter on.
 *
 * @extends Query
 */
class ConstantScoreQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(filterQuery) {
        super('constant_score');

        if (!isNil(filterQuery)) this.filter(filterQuery);
    }

    /**
     * Adds the query to apply a constant score to.
     *
     * @param {Query} filterQuery  Query to filter on.
     * @returns {ConstantScoreQuery} returns `this` so that calls can be chained.
     */
    filter(filterQuery) {
        checkType(filterQuery, Query);

        this._queryOpts.filter = filterQuery;
        return this;
    }

    /**
     * Adds the query to apply a constant score to.
     * Alias for method `filter`.
     *
     * Note: This parameter has been removed in elasticsearch 6.0. Use `filter` instead.
     *
     * @param {Query} filterQuery  Query to filter on.
     * @returns {ConstantScoreQuery} returns `this` so that calls can be chained.
     */
    query(filterQuery) {
        return this.filter(filterQuery);
    }
}

module.exports = ConstantScoreQuery;

},{"../../core":82,"lodash.isnil":183}],100:[function(require,module,exports){
'use strict';

const {
    Query,
    util: { checkType, setDefault }
} = require('../../core');

/**
 * A query that generates the union of documents produced by its subqueries,
 * and that scores each document with the maximum score for that document
 * as produced by any subquery, plus a tie breaking increment for
 * any additional matching subqueries.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-dis-max-query.html)
 *
 * @example
 * const qry = esb.disMaxQuery()
 *     .queries([esb.termQuery('age', 34), esb.termQuery('age', 35)])
 *     .tieBreaker(0.7)
 *     .boost(1.2);
 *
 * @example
 * const qry = esb.disMaxQuery()
 *     .queries([
 *         esb.matchQuery('subject', 'brown fox'),
 *         esb.matchQuery('message', 'brown fox')
 *     ])
 *     .tieBreaker(0.3);
 *
 * @extends Query
 */
class DisMaxQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('dis_max');
    }

    /**
     * Add given query to list of queries under given clause.
     *
     * @private
     * @param {Query} query
     * @throws {TypeError} If query is not an instance of `Query`
     */
    _addQuery(query) {
        checkType(query, Query);

        this._queryOpts.queries.push(query);
    }

    /**
     * The tie breaker value. The tie breaker capability allows results
     * that include the same term in multiple fields to be judged better than
     * results that include this term in only the best of those multiple
     * fields, without confusing this with the better case of two different
     * terms in the multiple fields. Default: `0.0`.
     *
     * @param {number} factor
     * @returns {DisMaxQuery} returns `this` so that calls can be chained.
     */
    tieBreaker(factor) {
        this._queryOpts.tie_breaker = factor;
        return this;
    }

    /**
     * Add given query array or query to list of queries
     *
     * @param {Array<Query>|Query} queries Array of valid `Query` objects or a `Query` object
     * @returns {DisMaxQuery} returns `this` so that calls can be chained.
     */
    queries(queries) {
        setDefault(this._queryOpts, 'queries', []);

        if (Array.isArray(queries)) queries.forEach(qry => this._addQuery(qry));
        else this._addQuery(queries);

        return this;
    }
}

module.exports = DisMaxQuery;

},{"../../core":82}],101:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Query,
    util: { checkType, invalidParam },
    consts: { SCORE_MODE_SET, BOOST_MODE_SET }
} = require('../../core');

const { ScoreFunction } = require('./score-functions');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html';

const invalidScoreModeParam = invalidParam(
    ES_REF_URL,
    'score_mode',
    SCORE_MODE_SET
);
const invalidBoostModeParam = invalidParam(
    ES_REF_URL,
    'boost_mode',
    BOOST_MODE_SET
);

/**
 * The `function_score` allows you to modify the score of documents that are
 * retrieved by a query. This can be useful if, for example, a score function
 * is computationally expensive and it is sufficient to compute the score on
 * a filtered set of documents.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html)
 *
 * @example
 * // `function_score` with only one function
 * const qry = esb.functionScoreQuery()
 *     .query(esb.matchAllQuery())
 *     .function(esb.randomScoreFunction())
 *     .boostMode('multiply')
 *     .boost('5');
 *
 * @example
 * // Several functions combined
 * const qry = esb.functionScoreQuery()
 *     .query(esb.matchAllQuery())
 *     .functions([
 *         esb.randomScoreFunction()
 *             .filter(esb.matchQuery('test', 'bar'))
 *             .weight(23),
 *         esb.weightScoreFunction()
 *             .filter(esb.matchQuery('test', 'cat'))
 *             .weight(42)
 *     ])
 *     .maxBoost(42)
 *     .scoreMode('max')
 *     .boostMode('multiply')
 *     .minScore(42)
 *     .boost('5');
 *
 * @example
 * // Combine decay functions
 * const qry = esb.functionScoreQuery()
 *     .functions([
 *         esb.decayScoreFunction('gauss', 'price').origin('0').scale('20'),
 *         esb.decayScoreFunction('gauss', 'location')
 *             .origin('11, 12')
 *             .scale('2km')
 *     ])
 *     .query(esb.matchQuery('properties', 'balcony'))
 *     .scoreMode('multiply');
 *
 * @extends Query
 */
class FunctionScoreQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('function_score');

        this._queryOpts.functions = [];
    }

    /**
     * Sets the source query.
     *
     * @param {Query} query A valid `Query` object
     * @returns {FunctionScoreQuery} returns `this` so that calls can be chained.
     */
    query(query) {
        checkType(query, Query);

        this._queryOpts.query = query;
        return this;
    }

    /**
     * Controls the way the scores are combined.
     *
     * @param {string} mode Can be one of `multiply`, `sum`, `first`, `min`, `max`, `avg`.
     * Defaults to `multiply`.
     * @returns {FunctionScoreQuery} returns `this` so that calls can be chained.
     */
    scoreMode(mode) {
        if (isNil(mode)) invalidScoreModeParam(mode);

        const modeLower = mode.toLowerCase();
        if (!SCORE_MODE_SET.has(modeLower)) {
            invalidScoreModeParam(mode);
        }

        this._queryOpts.score_mode = mode;
        return this;
    }

    /**
     * Controls the way the query and function scores are combined.
     *
     * @param {string} mode Can be one of `multiply`, `replace`, `sum`, `avg`, `max`, `min`.
     * Defaults to `multiply`.
     * @returns {FunctionScoreQuery} returns `this` so that calls can be chained.
     */
    boostMode(mode) {
        if (isNil(mode)) invalidBoostModeParam(mode);

        const modeLower = mode.toLowerCase();
        if (!BOOST_MODE_SET.has(modeLower)) {
            invalidBoostModeParam(mode);
        }

        this._queryOpts.boost_mode = modeLower;
        return this;
    }

    /**
     * Restricts new score to not exceed given limit. The default for `max_boost` is `FLT_MAX`.
     *
     * @param {number} limit
     * @returns {FunctionScoreQuery} returns `this` so that calls can be chained.
     */
    maxBoost(limit) {
        this._queryOpts.max_boost = limit;
        return this;
    }

    /**
     * Sets the minimum score limit for documents to be included in search result.
     *
     * @param {number} limit Minimum score threshold
     * @returns {FunctionScoreQuery} returns `this` so that calls can be chained.
     */
    minScore(limit) {
        this._queryOpts.min_score = limit;
        return this;
    }

    /**
     * Add a single score function to the list of existing functions.
     *
     * @param {ScoreFunction} func A valid `ScoreFunction` object.
     * @returns {FunctionScoreQuery} returns `this` so that calls can be chained.
     */
    function(func) {
        checkType(func, ScoreFunction);

        this._queryOpts.functions.push(func);
        return this;
    }

    /**
     * Adds array of score functions to the list of existing functions.
     *
     * @param {Array<ScoreFunction>} funcs An array of valid `ScoreFunction` objects
     * @returns {FunctionScoreQuery} returns `this` so that calls can be chained.
     */
    functions(funcs) {
        checkType(funcs, Array);

        funcs.forEach(func => this.function(func));
        return this;
    }
}

module.exports = FunctionScoreQuery;

},{"../../core":82,"./score-functions":105,"lodash.isnil":183}],102:[function(require,module,exports){
'use strict';

exports.scoreFunctions = require('./score-functions');

exports.ConstantScoreQuery = require('./constant-score-query');
exports.BoolQuery = require('./bool-query');
exports.DisMaxQuery = require('./dis-max-query');
exports.FunctionScoreQuery = require('./function-score-query');
exports.BoostingQuery = require('./boosting-query');

// This was deprecated in 5.0, not implementing
// exports.IndicesQuery = require('./indices-query');

},{"./bool-query":97,"./boosting-query":98,"./constant-score-query":99,"./dis-max-query":100,"./function-score-query":101,"./score-functions":105}],103:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { invalidParam, recursiveToJSON }
} = require('../../../core');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-decay';

const ScoreFunction = require('./score-function');

const invalidModeParam = invalidParam(
    ES_REF_URL,
    'mode',
    "'linear', 'exp' or 'gauss'"
);

/**
 * Decay functions score a document with a function that decays depending on
 * the distance of a numeric field value of the document from a user given
 * origin. This is similar to a range query, but with smooth edges instead of
 * boxes.
 *
 * Supported decay functions are: `linear`, `exp`, and `gauss`.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-decay)
 *
 * If no `mode` is supplied, `gauss` will be used.
 *
 * @example
 * // Defaults to decay function `gauss`
 * const decayFunc = esb.decayScoreFunction()
 *     .field('location') // field is a geo_point
 *     .origin('11, 12') // geo format
 *     .scale('2km')
 *     .offset('0km')
 *     .decay(0.33);
 *
 * @example
 * const decayFunc = esb.decayScoreFunction('gauss', 'date')
 *     .origin('2013-09-17')
 *     .scale('10d')
 *     .offset('5d')
 *     .decay(0.5);
 *
 * @param {string=} mode Can be one of `linear`, `exp`, and `gauss`.
 * Defaults to `gauss`.
 * @param {string=} field the document field to run decay function against.
 *
 * @extends ScoreFunction
 */
class DecayScoreFunction extends ScoreFunction {
    // eslint-disable-next-line require-jsdoc
    constructor(mode = 'gauss', field) {
        super(mode);

        if (!isNil(field)) this._field = field;
    }

    /**
     * Set the decay mode.
     *
     * @param {string} mode  Can be one of `linear`, `exp`, and `gauss`.
     * Defaults to `gauss`.
     * @returns {DecayScoreFunction} returns `this` so that calls can be chained.
     */
    mode(mode) {
        if (isNil(mode)) invalidModeParam(mode);

        const modeLower = mode.toLowerCase();
        if (
            modeLower !== 'linear' &&
            modeLower !== 'exp' &&
            modeLower !== 'gauss'
        ) {
            invalidModeParam(mode);
        }

        this._name = mode;
        return this;
    }

    /**
     * Sets the decay mode to linear.
     * Alias for `mode('linear')`
     *
     * @returns {DecayScoreFunction} returns `this` so that calls can be chained.
     */
    linear() {
        this._name = 'linear';
        return this;
    }

    /**
     * Sets the decay mode to exp.
     * Alias for `mode('exp')`
     *
     * @returns {DecayScoreFunction} returns `this` so that calls can be chained.
     */
    exp() {
        this._name = 'exp';
        return this;
    }

    /**
     * Sets the decay mode to gauss.
     * Alias for `mode('gauss')`
     *
     * @returns {DecayScoreFunction} returns `this` so that calls can be chained.
     */
    gauss() {
        this._name = 'gauss';
        return this;
    }

    /**
     * Sets the document field to run decay function against.
     *
     * @param {string} field the document field to run decay function against.
     * @returns {DecayScoreFunction} returns `this` so that calls can be chained.
     */
    field(field) {
        this._field = field;
        return this;
    }

    /**
     * The point of origin used for calculating distance. Must be given as a number
     * for numeric field, date for date fields and geo point for geo fields.
     * Required for geo and numeric field. For date fields the default is `now`.
     * Date math (for example `now-1h`) is supported for origin.
     *
     * @param {number|string|Object} origin A valid origin value for the field type.
     * @returns {DecayScoreFunction} returns `this` so that calls can be chained.
     */
    origin(origin) {
        this._opts.origin = origin;
        return this;
    }

    /**
     * Required for all types. Defines the distance from origin + offset at which
     * the computed score will equal decay parameter. For geo fields: Can be defined
     * as number+unit (`1km`, `12m`,…). Default unit is meters. For date fields: Can be
     * defined as a number+unit (`1h`, `10d`,…). Default unit is milliseconds.
     * For numeric field: Any number.
     *
     * @param {number|string} scale A valid scale value for the field type.
     * @returns {DecayScoreFunction} returns `this` so that calls can be chained.
     */
    scale(scale) {
        this._opts.scale = scale;
        return this;
    }

    /**
     * If an `offset` is defined, the decay function will only compute the decay function
     * for documents with a distance greater that the defined offset. The default is `0`.
     *
     * @param {number|string} offset A valid offset value for the field type.
     * @returns {DecayScoreFunction} returns `this` so that calls can be chained.
     */
    offset(offset) {
        this._opts.offset = offset;
        return this;
    }

    /**
     * The `decay` parameter defines how documents are scored at the distance given at `scale`.
     * If no `decay` is defined, documents at the distance `scale` will be scored `0.5`.
     *
     * @param {number} decay A decay value as a double.
     * @returns {DecayScoreFunction} returns `this` so that calls can be chained.
     */
    decay(decay) {
        this._opts.decay = decay;
        return this;
    }

    /**
     * Overrides default `toJSON` to return DSL representation of the decay score function
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        // TODO: If mode/field is not set throw an error.
        const repr = Object.assign(
            { [this._name]: { [this._field]: this._opts } },
            this._body
        );
        return recursiveToJSON(repr);
    }
}

module.exports = DecayScoreFunction;

},{"../../../core":82,"./score-function":107,"lodash.isnil":183}],104:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { invalidParam },
    consts: { FIELD_MODIFIER_SET }
} = require('../../../core');

const ScoreFunction = require('./score-function');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-field-value-factor';

const invaliModifierdParam = invalidParam(
    ES_REF_URL,
    'modifier',
    FIELD_MODIFIER_SET
);

/**
 * The `field_value_factor` function allows you to use a field from a document
 * to influence the score. It's similar to using the `script_score` function, however,
 * it avoids the overhead of scripting. If used on a multi-valued field, only the
 * first value of the field is used in calculations.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-field-value-factor)
 *
 * @example
 * // Scoring formula - sqrt(1.2 * doc['popularity'].value)
 * const scoreFunc = esb.fieldValueFactorFunction('popularity')
 *     .factor(1.2)
 *     .modifier('sqrt')
 *     .missing(1);
 *
 * @param {string=} field the field to be extracted from the document.
 *
 * @extends ScoreFunction
 */
class FieldValueFactorFunction extends ScoreFunction {
    // eslint-disable-next-line require-jsdoc
    constructor(field) {
        super('field_value_factor');

        if (!isNil(field)) this._opts.field = field;
    }

    /**
     * Sets the field to be extracted from the document.
     *
     * @param {string} field the field to be extracted from the document.
     * @returns {FieldValueFactorFunction} returns `this` so that calls can be chained.
     */
    field(field) {
        this._opts.field = field;
        return this;
    }

    /**
     * Optional factor to multiply the field value with, defaults to `1`.
     *
     * @param {number} factor Factor to multiply the field with.
     * @returns {FieldValueFactorFunction} returns `this` so that calls can be chained.
     */
    factor(factor) {
        this._opts.factor = factor;
        return this;
    }

    /**
     * Modifier to apply to the field value, can be one of: `none`, `log`,
     * `log1p`, `log2p`, `ln`, `ln1p`, `ln2p`, `square`, `sqrt`, or `reciprocal`.
     * Defaults to `none`.
     *
     * @param {string} mod Modified to apply on field. Can be one of: `none`, `log`,
     * `log1p`, `log2p`, `ln`, `ln1p`, `ln2p`, `square`, `sqrt`, or `reciprocal`.
     * Defaults to `none`.
     * @returns {FieldValueFactorFunction} returns `this` so that calls can be chained.
     */
    modifier(mod) {
        if (isNil(mod)) invaliModifierdParam(mod);

        const modLower = mod.toLowerCase();
        if (!FIELD_MODIFIER_SET.has(modLower)) {
            invaliModifierdParam(mod);
        }

        this._opts.modifier = modLower;
        return this;
    }

    /**
     * Value used if the document doesn’t have that field. The modifier and factor
     * are still applied to it as though it were read from the document.
     *
     * @param {number} val To be used with documents which do not have field value.
     * @returns {FieldValueFactorFunction} returns `this` so that calls can be chained.
     */
    missing(val) {
        this._opts.missing = val;
        return this;
    }
}

module.exports = FieldValueFactorFunction;

},{"../../../core":82,"./score-function":107,"lodash.isnil":183}],105:[function(require,module,exports){
'use strict';

exports.ScoreFunction = require('./score-function');
exports.ScriptScoreFunction = require('./script-score-function');
exports.WeightScoreFunction = require('./weight-score-function');
exports.RandomScoreFunction = require('./random-score-function');
exports.FieldValueFactorFunction = require('./field-value-factor-function');
exports.DecayScoreFunction = require('./decay-score-function');

},{"./decay-score-function":103,"./field-value-factor-function":104,"./random-score-function":106,"./score-function":107,"./script-score-function":108,"./weight-score-function":109}],106:[function(require,module,exports){
'use strict';

const ScoreFunction = require('./score-function');

/**
 * The `random_score` generates scores using a hash of the `_uid` field,
 * with a `seed` for variation. If `seed` is not specified, the current time is used.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-random)
 *
 * @example
 * const scoreFunc = esb.randomScoreFunction().seed(299792458);
 *
 * @extends ScoreFunction
 */
class RandomScoreFunction extends ScoreFunction {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('random_score');
    }

    /**
     * Sets random seed value.
     *
     * @param {number} seed A seed value.
     * @returns {RandomScoreFunction} returns `this` so that calls can be chained.
     */
    seed(seed) {
        this._opts.seed = seed;
        return this;
    }
}

module.exports = RandomScoreFunction;

},{"./score-function":107}],107:[function(require,module,exports){
'use strict';

const {
    Query,
    util: { checkType, recursiveToJSON }
} = require('../../../core');

/**
 * `ScoreFunction` provides support for common options used across
 * various `ScoreFunction` implementations.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#score-functions)
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} name
 */
class ScoreFunction {
    // eslint-disable-next-line require-jsdoc
    constructor(name) {
        this._name = name;

        // Filter, weight go here
        this._body = {};
        // Score Function specific options go here
        this._opts = {};
    }

    /**
     * Adds a filter query whose matching documents will have the score function applied.
     *
     * @param {Query} filterQry A valid `Query` object.
     * @returns {ScoreFunction} returns `this` so that calls can be chained.
     */
    filter(filterQry) {
        checkType(filterQry, Query);

        this._body.filter = filterQry;
        return this;
    }

    /**
     * Sets the weight of the score function
     *
     * @param {number} weight The weight of this score function.
     * @returns {ScoreFunction} returns `this` so that calls can be chained.
     */
    weight(weight) {
        this._body.weight = weight;
        return this;
    }

    /**
     * Overrides default `toJSON` to return DSL representation of the score function
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        const repr = Object.assign({ [this._name]: this._opts }, this._body);
        return recursiveToJSON(repr);
    }
}

module.exports = ScoreFunction;

},{"../../../core":82}],108:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const ScoreFunction = require('./score-function');

/**
 * The `script_score` function allows you to wrap another query and customize
 * the scoring of it optionally with a computation derived from other numeric
 * field values in the doc using a script expression.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-script-score)
 *
 * @example
 * const scoreFunc = esb.scriptScoreFunction(
 *     esb.script('inline', "_score * doc['my_numeric_field'].value")
 *         .lang('painless')
 * );
 *
 * @example
 * // Script with parameters
 * const scoreFunc = esb.scriptScoreFunction(
 *     esb.script(
 *         'inline',
 *         "_score * doc['my_numeric_field'].value / Math.pow(params.param1, params.param2)"
 *     )
 *         .lang('painless')
 *         .params({ param1: 'value1', param2: 'value2' })
 * );
 *
 * @param {Script|string} script
 *
 * @extends ScoreFunction
 */
class ScriptScoreFunction extends ScoreFunction {
    // eslint-disable-next-line require-jsdoc
    constructor(script) {
        super('script_score');

        if (!isNil(script)) this._opts.script = script;
    }

    /**
     *
     * @param {Script|string} script
     * @returns {ScriptScoreFunction} returns `this` so that calls can be chained.
     */
    script(script) {
        this._opts.script = script;
        return this;
    }
}

module.exports = ScriptScoreFunction;

},{"./score-function":107,"lodash.isnil":183}],109:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const ScoreFunction = require('./score-function');

const {
    util: { recursiveToJSON }
} = require('../../../core');

/**
 * The `weight` score allows you to multiply the score by the provided `weight`.
 * This can sometimes be desired since boost value set on specific queries gets
 * normalized, while for this score function it does not.
 * The number value is of type float.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-weight)
 *
 * @example
 * const scoreFunc = esb.weightScoreFunction(42);
 *
 * @param {number=} weight The weight of this score function.
 * @extends ScoreFunction
 */
class WeightScoreFunction extends ScoreFunction {
    // eslint-disable-next-line require-jsdoc
    constructor(weight) {
        /*
            null to `super` is intentional.
            The following is a valid score function
            It doesn't have a name field
            {
                "filter": { "match": { "test": "cat" } },
                "weight": 42
            }
        */
        super(null);

        if (!isNil(weight)) this._body.weight = weight;
    }

    /**
     * Overrides default `toJSON` to return DSL representation of the score function
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        return recursiveToJSON(this._body);
    }
}

module.exports = WeightScoreFunction;

},{"../../../core":82,"./score-function":107,"lodash.isnil":183}],110:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { checkType, invalidParam }
} = require('../../core');
const FullTextQueryBase = require('./full-text-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-combined-fields-query.html';

const invalidOperatorParam = invalidParam(
    ES_REF_URL,
    'operator',
    "'and' or 'or'"
);
const invalidZeroTermsQueryParam = invalidParam(
    ES_REF_URL,
    'zero_terms_query',
    "'all' or 'none'"
);

/**
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-combined-fields-query.html)
 *
 * @example
 * const qry = esb.combinedFieldsQuery(['subject', 'message'], 'this is a test');
 *
 * NOTE: This query was added in elasticsearch v7.13.
 *
 * @param {Array<string>|string=} fields The fields to be queried
 * @param {string=} queryString The query string
 *
 * @extends FullTextQueryBase
 */
class CombinedFieldsQuery extends FullTextQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(fields, queryString) {
        super('combined_fields', queryString);

        // This field is required
        // Avoid checking for key in `this.field`
        this._queryOpts.fields = [];

        if (!isNil(fields)) {
            if (Array.isArray(fields)) this.fields(fields);
            else this.field(fields);
        }
    }

    /**
     * Appends given field to the list of fields to search against.
     * Fields can be specified with wildcards.
     * Individual fields can be boosted with the caret (^) notation.
     * Example - `"subject^3"`
     *
     * @param {string} field One of the fields to be queried
     * @returns {CombinedFieldsQuery} returns `this` so that calls can be chained.
     */
    field(field) {
        this._queryOpts.fields.push(field);
        return this;
    }

    /**
     * Appends given fields to the list of fields to search against.
     * Fields can be specified with wildcards.
     * Individual fields can be boosted with the caret (^) notation.
     *
     * @example
     * // Boost individual fields with caret `^` notation
     * const qry = esb.combinedFieldsQuery(['subject^3', 'message'], 'this is a test');
     *
     * @example
     * // Specify fields with wildcards
     * const qry = esb.combinedFieldsQuery(['title', '*_name'], 'Will Smith');
     *
     * @param {Array<string>} fields The fields to be queried
     * @returns {CombinedFieldsQuery} returns `this` so that calls can be chained.
     */
    fields(fields) {
        checkType(fields, Array);

        this._queryOpts.fields = this._queryOpts.fields.concat(fields);
        return this;
    }

    /**
     * If true, match phrase queries are automatically created for multi-term synonyms.
     *
     * @param {boolean} enable Defaults to `true`
     * @returns {CombinedFieldsQuery} returns `this` so that calls can be chained.
     */
    autoGenerateSynonymsPhraseQuery(enable) {
        this._queryOpts.auto_generate_synonyms_phrase_query = enable;
        return this;
    }

    /**
     * The operator to be used in the boolean query which is constructed
     * by analyzing the text provided. The `operator` flag can be set to `or` or
     * `and` to control the boolean clauses (defaults to `or`).
     *
     * @param {string} operator Can be `and`/`or`. Default is `or`.
     * @returns {CombinedFieldsQuery} returns `this` so that calls can be chained.
     */
    operator(operator) {
        if (isNil(operator)) invalidOperatorParam(operator);

        const operatorLower = operator.toLowerCase();
        if (operatorLower !== 'and' && operatorLower !== 'or') {
            invalidOperatorParam(operator);
        }

        this._queryOpts.operator = operatorLower;
        return this;
    }

    /**
     * If the analyzer used removes all tokens in a query like a `stop` filter does,
     * the default behavior is to match no documents at all. In order to change that
     * the `zero_terms_query` option can be used, which accepts `none` (default) and `all`
     * which corresponds to a `match_all` query.
     *
     * @example
     * const qry = esb.combinedFieldsQuery('message', 'to be or not to be')
     *     .operator('and')
     *     .zeroTermsQuery('all');
     *
     * @param {string} behavior A no match action, `all` or `none`. Default is `none`.
     * @returns {CombinedFieldsQuery} returns `this` so that calls can be chained.
     */
    zeroTermsQuery(behavior) {
        if (isNil(behavior)) invalidZeroTermsQueryParam(behavior);

        const behaviorLower = behavior.toLowerCase();
        if (behaviorLower !== 'all' && behaviorLower !== 'none') {
            invalidZeroTermsQueryParam(behavior);
        }

        this._queryOpts.zero_terms_query = behaviorLower;
        return this;
    }
}

module.exports = CombinedFieldsQuery;

},{"../../core":82,"./full-text-query-base":112,"lodash.isnil":183}],111:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');
const isObject = require('lodash.isobject');

const {
    util: { invalidParam, setDefault }
} = require('../../core');

const MonoFieldQueryBase = require('./mono-field-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-common-terms-query.html';

const invalidLowFreqOpParam = invalidParam(
    ES_REF_URL,
    'low_freq_operator',
    "'and' or 'or'"
);
const invalidHighFreqOpParam = invalidParam(
    ES_REF_URL,
    'high_freq_operator',
    "'and' or 'or'"
);

/**
 * The `common` terms query is a modern alternative to stopwords which
 * improves the precision and recall of search results (by taking
 * stopwords into account), without sacrificing performance.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-common-terms-query.html)
 *
 * @example
 * const qry = esb.commonTermsQuery('body','this is bonsai cool')
 *     .cutoffFrequency(0.001);
 *
 * @param {string=} field The document field to query against
 * @param {string=} queryString The query string
 *
 * @extends MonoFieldQueryBase
 */
class CommonTermsQuery extends MonoFieldQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field, queryString) {
        super('common', field, queryString);
    }

    /**
     * Print warning message to console namespaced by class name.
     *
     * @param {string} msg
     * @private
     */
    _warn(msg) {
        console.warn(`[CommonTermsQuery] ${msg}`);
    }

    /**
     * Print warning messages to not mix Geo Point representations
     * @private
     */
    _warnMixedRepr() {
        this._warn('Do not mix with other representation!');
        this._warn('Overwriting.');
    }

    /**
     * Check the instance for object representation of Geo Point.
     * If representation is null, new object is initialised.
     * If it is not null, warning is logged and point is overwritten.
     * @private
     */
    _checkMinMatchRepr() {
        if (
            !setDefault(this._queryOpts, 'minimum_should_match', {}) &&
            !isObject(this._queryOpts.minimum_should_match)
        ) {
            this._warnMixedRepr();
            this._queryOpts.minimum_should_match = {};
        }
    }

    /**
     * Allows specifying an absolute or relative document frequency where high frequency
     * terms are moved into an optional subquery and are only scored if one of the
     * low frequency (below the cutoff) terms in the case of an `or` operator or
     * all of the low frequency terms in the case of an `and` operator match.
     *
     * @param {number} frequency It can either be relative to the total number of documents
     * if in the range `[0..1)` or absolute if greater or equal to `1.0`.
     * @returns {CommonTermsQuery} returns `this` so that calls can be chained.
     */
    cutoffFrequency(frequency) {
        this._queryOpts.cutoff_frequency = frequency;
        return this;
    }

    /**
     * The operator to be used on low frequency terms in the boolean query
     * which is constructed by analyzing the text provided. The `operator` flag
     * can be set to `or` or `and` to control the boolean clauses (defaults to `or`).
     *
     * @example
     * const qry = esb.commonTermsQuery('body', 'nelly the elephant as a cartoon')
     *     .lowFreqOperator('and')
     *     .cutoffFrequency(0.001);
     *
     * @param {string} operator Can be `and`/`or`. Default is `or`.
     * @returns {CommonTermsQuery} returns `this` so that calls can be chained.
     */
    lowFreqOperator(operator) {
        if (isNil(operator)) invalidLowFreqOpParam(operator);

        const operatorLower = operator.toLowerCase();
        if (operatorLower !== 'and' && operatorLower !== 'or') {
            invalidLowFreqOpParam(operator);
        }

        this._queryOpts.low_freq_operator = operatorLower;
        return this;
    }

    /**
     * The operator to be used on high frequency terms in the boolean query
     * which is constructed by analyzing the text provided. The `operator` flag
     * can be set to `or` or `and` to control the boolean clauses (defaults to `or`).
     *
     * @param {string} operator Can be `and`/`or`. Default is `or`.
     * @returns {CommonTermsQuery} returns `this` so that calls can be chained.
     */
    highFreqOperator(operator) {
        if (isNil(operator)) invalidHighFreqOpParam(operator);

        const operatorLower = operator.toLowerCase();
        if (operatorLower !== 'and' && operatorLower !== 'or') {
            invalidHighFreqOpParam(operator);
        }

        this._queryOpts.high_freq_operator = operatorLower;
        return this;
    }

    /**
     * Sets the value controlling how many "should" clauses in the resulting boolean
     * query should match for low frequency terms. It can be an absolute value (2),
     * a percentage (30%) or a combination of both.
     *
     * @example
     * const qry = esb.commonTermsQuery('body', 'nelly the elephant as a cartoon')
     *     .lowFreq(2)
     *     .highFreq(3)
     *     .cutoffFrequency(0.001);
     *
     * @param {string|number} lowFreqMinMatch
     * @returns {CommonTermsQuery} returns `this` so that calls can be chained.
     */
    lowFreq(lowFreqMinMatch) {
        this._checkMinMatchRepr();

        this._queryOpts.minimum_should_match.low_freq = lowFreqMinMatch;
        return this;
    }

    /**
     * Sets the value controlling how many "should" clauses in the resulting boolean
     * query should match for high frequency terms. It can be an absolute value (2),
     * a percentage (30%) or a combination of both.
     *
     * @example
     * const qry = esb.commonTermsQuery('body', 'nelly the elephant as a cartoon')
     *     .lowFreq(2)
     *     .highFreq(3)
     *     .cutoffFrequency(0.001);
     *
     * @param {string|number} highFreqMinMatch
     * @returns {CommonTermsQuery} returns `this` so that calls can be chained.
     */
    highFreq(highFreqMinMatch) {
        this._checkMinMatchRepr();

        this._queryOpts.minimum_should_match.high_freq = highFreqMinMatch;
        return this;
    }

    /**
     * Enables or disables similarity coordinate scoring of documents
     * commoning the `CommonTermsQuery`. Default: `false`.
     *
     * **NOTE**: This has been removed in elasticsearch 6.0. If provided,
     * it will be ignored and a deprecation warning will be issued.
     *
     * @param {boolean} enable
     * @returns {CommonTermsQuery} returns `this` so that calls can be chained.
     */
    disableCoord(enable) {
        this._queryOpts.disable_coord = enable;
        return this;
    }
}

module.exports = CommonTermsQuery;

},{"../../core":82,"./mono-field-query-base":118,"lodash.isnil":183,"lodash.isobject":184}],112:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const { Query } = require('../../core');

/**
 * The `FullTextQueryBase` provides support for common options used across
 * various full text query implementations.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} queryType
 * @param {string=} queryString The query string
 *
 * @extends Query
 */
class FullTextQueryBase extends Query {
    /*
        Common options:
        analyzer - applicable on all
        minimum_should_match - applicable on all except Match Phrase and Match Phrase Prefix
        query - applicable on all
    */

    // eslint-disable-next-line require-jsdoc
    constructor(queryType, queryString) {
        super(queryType);

        if (!isNil(queryString)) this._queryOpts.query = queryString;
    }

    /**
     * Set the analyzer to control which analyzer will perform the analysis process on the text
     *
     * @example
     * const qry = esb.matchPhraseQuery('message', 'this is a test')
     *     .analyzer('my_analyzer');
     *
     * @example
     * const qry = esb.multiMatchQuery(['first', 'last', '*.edge'], 'Jon')
     *     .type('cross_fields')
     *     .analyzer('standard');
     *
     * @param {string} analyzer
     * @returns {FullTextQueryBase} returns `this` so that calls can be chained.
     */
    analyzer(analyzer) {
        this._queryOpts.analyzer = analyzer;
        return this;
    }

    /**
     * Sets the value controlling how many "should" clauses in the resulting boolean
     * query should match. It can be an absolute value (2), a percentage (30%)
     * or a combination of both. For Common Terms Query when specifying different
     * `minimum_should_match` for low and high frequency terms, an object with the
     * keys `low_freq` and `high_freq` can be used.
     *
     * @example
     * const qry = esb.commonTermsQuery('body', 'nelly the elephant as a cartoon')
     *     .minimumShouldMatch(2)
     *     .cutoffFrequency(0.001);
     *
     * @param {string|number|Object} minimumShouldMatch
     * Note: Object notation can only be used with Common Terms Query.
     * @returns {FullTextQueryBase} returns `this` so that calls can be chained.
     */
    minimumShouldMatch(minimumShouldMatch) {
        this._queryOpts.minimum_should_match = minimumShouldMatch;
        return this;
    }

    /**
     * Sets the query string.
     *
     * @example
     * const qry = esb.queryStringQuery()
     *     .query('city.\\*:(this AND that OR thus)')
     *     .useDisMax(true);
     *
     * @param {string} queryString
     * @returns {FullTextQueryBase} returns `this` so that calls can be chained.
     */
    query(queryString) {
        this._queryOpts.query = queryString;
        return this;
    }
}

module.exports = FullTextQueryBase;

},{"../../core":82,"lodash.isnil":183}],113:[function(require,module,exports){
'use strict';

exports.FullTextQueryBase = require('./full-text-query-base');
exports.MatchPhraseQueryBase = require('./match-phrase-query-base');
exports.MonoFieldQueryBase = require('./mono-field-query-base');
exports.QueryStringQueryBase = require('./query-string-query-base');

exports.MatchQuery = require('./match-query');
exports.MatchPhraseQuery = require('./match-phrase-query');
exports.MatchPhrasePrefixQuery = require('./match-phrase-prefix-query');
exports.MultiMatchQuery = require('./multi-match-query');
exports.CommonTermsQuery = require('./common-terms-query');
exports.QueryStringQuery = require('./query-string-query');
exports.SimpleQueryStringQuery = require('./simple-query-string-query');
exports.CombinedFieldsQuery = require('./combined-fields-query');

},{"./combined-fields-query":110,"./common-terms-query":111,"./full-text-query-base":112,"./match-phrase-prefix-query":114,"./match-phrase-query":116,"./match-phrase-query-base":115,"./match-query":117,"./mono-field-query-base":118,"./multi-match-query":119,"./query-string-query":121,"./query-string-query-base":120,"./simple-query-string-query":122}],114:[function(require,module,exports){
'use strict';

const MatchPhraseQueryBase = require('./match-phrase-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase-prefix.html';

/**
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase-prefix.html)
 *
 * @example
 * const qry = esb.matchPhrasePrefixQuery('message', 'quick brown f');
 *
 * @param {string=} field The document field to query against
 * @param {string=} queryString The query string
 *
 * @extends MatchPhraseQueryBase
 */
class MatchPhrasePrefixQuery extends MatchPhraseQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field, queryString) {
        super('match_phrase_prefix', ES_REF_URL, field, queryString);
    }

    /**
     * Control to how many prefixes the last term will be expanded.
     *
     * @example
     * const qry = esb.matchPhrasePrefixQuery('message', 'quick brown f')
     *     .maxExpansions(10);
     *
     * @param {number} limit Defaults to 50.
     * @returns {MatchPhrasePrefixQuery} returns `this` so that calls can be chained.
     */
    maxExpansions(limit) {
        this._queryOpts.max_expansions = limit;
        return this;
    }
}

module.exports = MatchPhrasePrefixQuery;

},{"./match-phrase-query-base":115}],115:[function(require,module,exports){
'use strict';

const MonoFieldQueryBase = require('./mono-field-query-base');

/**
 * The `MatchPhraseQueryBase` provides support for common options used across
 * various bucket match phrase query implementations.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} queryType
 * @param {string} refUrl
 * @param {string=} field The document field to query against
 * @param {string=} queryString The query string
 *
 * @extends MonoFieldQueryBase
 */
class MatchPhraseQueryBase extends MonoFieldQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(queryType, refUrl, field, queryString) {
        super(queryType, field, queryString);

        this._refUrl = refUrl;
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on `MatchPhraseQueryBase`
     */
    minimumShouldMatch() {
        console.log(`Please refer ${this._refUrl}`);
        throw new Error(
            `minimumShouldMatch is not supported in ${this.constructor.name}`
        );
    }

    /**
     * Configures the `slop`(default is 0) for matching terms in any order.
     * Transposed terms have a slop of 2.
     *
     * @param {number} slop A positive integer value, defaults is 0.
     * @returns {MatchPhraseQueryBase} returns `this` so that calls can be chained.
     */
    slop(slop) {
        this._queryOpts.slop = slop;
        return this;
    }
}

module.exports = MatchPhraseQueryBase;

},{"./mono-field-query-base":118}],116:[function(require,module,exports){
'use strict';

const MatchPhraseQueryBase = require('./match-phrase-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html';

/**
 * The `match_phrase` query analyzes the text and creates a `phrase` query out of
 * the analyzed text.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html)
 *
 * @example
 * const qry = esb.matchPhraseQuery('message', 'to be or not to be');
 *
 * @param {string=} field The document field to query against
 * @param {string=} queryString The query string
 *
 * @extends MatchPhraseQueryBase
 */
class MatchPhraseQuery extends MatchPhraseQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field, queryString) {
        super('match_phrase', ES_REF_URL, field, queryString);
    }
}

module.exports = MatchPhraseQuery;

},{"./match-phrase-query-base":115}],117:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { invalidParam }
} = require('../../core');
const MonoFieldQueryBase = require('./mono-field-query-base');
const { validateRewiteMethod } = require('../helper');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html';

const invalidOperatorParam = invalidParam(
    ES_REF_URL,
    'operator',
    "'and' or 'or'"
);
const invalidZeroTermsQueryParam = invalidParam(
    ES_REF_URL,
    'zero_terms_query',
    "'all' or 'none'"
);

/**
 * `match` query accepts text/numerics/dates, analyzes them, and constructs a query.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html)
 *
 * @param {string=} field The document field to query against
 * @param {string=} queryString The query string
 *
 * @example
 * const matchQry = esb.matchQuery('message', 'to be or not to be');
 *
 * @example
 * // Providing additional parameters:
 * const qry = esb.matchQuery('message', 'this is a test').operator('and');
 *
 * @extends MonoFieldQueryBase
 */
class MatchQuery extends MonoFieldQueryBase {
    // NOTE: Did not add methods for `slop`, `phrase_slop` and `type`.
    // These are deprecated.

    // eslint-disable-next-line require-jsdoc
    constructor(field, queryString) {
        super('match', field, queryString);
    }

    /**
     * The operator to be used in the boolean query which is constructed
     * by analyzing the text provided. The `operator` flag can be set to `or` or
     * `and` to control the boolean clauses (defaults to `or`).
     *
     * @param {string} operator Can be `and`/`or`. Default is `or`.
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     */
    operator(operator) {
        if (isNil(operator)) invalidOperatorParam(operator);

        const operatorLower = operator.toLowerCase();
        if (operatorLower !== 'and' && operatorLower !== 'or') {
            invalidOperatorParam(operator);
        }

        this._queryOpts.operator = operatorLower;
        return this;
    }

    /**
     * Sets the `lenient` parameter which allows to ignore exceptions caused
     * by data-type mismatches such as trying to query a numeric field with a
     * text query string when set to `true`.
     *
     * @param {boolean} enable Defaules to `false`
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     */
    lenient(enable) {
        this._queryOpts.lenient = enable;
        return this;
    }

    /**
     * Sets the `fuzziness` parameter which is interpreted as a Levenshtein Edit Distance —
     * the number of one character changes that need to be made to one string to make it
     * the same as another string.
     *
     * @param {number|string} factor Can be specified either as a number, or the maximum
     * number of edits, or as `AUTO` which generates an edit distance based on the length
     * of the term.
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     */
    fuzziness(factor) {
        this._queryOpts.fuzziness = factor;
        return this;
    }

    /**
     * Sets the prefix length for a fuzzy prefix `MatchQuery`
     *
     * @param {number} len
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     */
    prefixLength(len) {
        this._queryOpts.prefix_length = len;
        return this;
    }

    /**
     * Sets the max expansions for a fuzzy prefix `MatchQuery`
     *
     * @param {number} limit
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     */
    maxExpansions(limit) {
        this._queryOpts.max_expansions = limit;
        return this;
    }

    /**
     * Sets the rewrite method. Valid values are:
     * - `constant_score` - tries to pick the best constant-score rewrite
     *  method based on term and document counts from the query.
     *  Synonyms - `constant_score_auto`, `constant_score_filter`
     *
     * - `scoring_boolean` - translates each term into boolean should and
     *  keeps the scores as computed by the query
     *
     * - `constant_score_boolean` - same as `scoring_boolean`, expect no scores
     *  are computed.
     *
     * - `constant_score_filter` - first creates a private Filter, by visiting
     *  each term in sequence and marking all docs for that term
     *
     * - `top_terms_boost_N` - first translates each term into boolean should
     *  and scores are only computed as the boost using the top N
     *  scoring terms. Replace N with an integer value.
     *
     * - `top_terms_N` - first translates each term into boolean should
     *  and keeps the scores as computed by the query. Only the top N
     *  scoring terms are used. Replace N with an integer value.
     *
     * Default is `constant_score`.
     *
     * Note: The deprecated multi term rewrite parameters `constant_score_auto`,
     * `constant_score_filter` (synonyms for `constant_score`) have been removed
     * in elasticsearch 6.0.
     *
     * This is an advanced option, use with care.
     *
     * @param {string} method The rewrite method as a string.
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     * @throws {Error} If the given `rewrite` method is not valid.
     */
    rewrite(method) {
        validateRewiteMethod(method, 'rewrite', ES_REF_URL);

        this._queryOpts.rewrite = method;
        return this;
    }

    /**
     * Sets the fuzzy rewrite method. Valid values are:
     * - `constant_score` - tries to pick the best constant-score rewrite
     *  method based on term and document counts from the query.
     *  Synonyms - `constant_score_auto`, `constant_score_filter`
     *
     * - `scoring_boolean` - translates each term into boolean should and
     *  keeps the scores as computed by the query
     *
     * - `constant_score_boolean` - same as `scoring_boolean`, expect no scores
     *  are computed.
     *
     * - `constant_score_filter` - first creates a private Filter, by visiting
     *  each term in sequence and marking all docs for that term
     *
     * - `top_terms_boost_N` - first translates each term into boolean should
     *  and scores are only computed as the boost using the top N
     *  scoring terms. Replace N with an integer value.
     *
     * - `top_terms_N` - first translates each term into boolean should
     *  and keeps the scores as computed by the query. Only the top N
     *  scoring terms are used. Replace N with an integer value.
     *
     * Default is `constant_score`.
     *
     * This is an advanced option, use with care.
     *
     * Note: The deprecated multi term rewrite parameters `constant_score_auto`,
     * `constant_score_filter` (synonyms for `constant_score`) have been removed
     * in elasticsearch 6.0.
     *
     * @param {string} method The rewrite method as a string.
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     * @throws {Error} If the given `fuzzy_rewrite` method is not valid.
     */
    fuzzyRewrite(method) {
        validateRewiteMethod(method, 'fuzzy_rewrite', ES_REF_URL);

        this._queryOpts.fuzzy_rewrite = method;
        return this;
    }

    /**
     * Fuzzy transpositions (`ab` → `ba`) are allowed by default but can be disabled
     * by setting `fuzzy_transpositions` to false.
     * @param {boolean} enable
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     */
    fuzzyTranspositions(enable) {
        this._queryOpts.fuzzy_transpositions = enable;
        return this;
    }

    /**
     * If the analyzer used removes all tokens in a query like a `stop` filter does,
     * the default behavior is to match no documents at all. In order to change that
     * the `zero_terms_query` option can be used, which accepts `none` (default) and `all`
     * which corresponds to a `match_all` query.
     *
     * @example
     * const qry = esb.matchQuery('message', 'to be or not to be')
     *     .operator('and')
     *     .zeroTermsQuery('all');
     *
     * @param {string} behavior A no match action, `all` or `none`. Default is `none`.
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     */
    zeroTermsQuery(behavior) {
        if (isNil(behavior)) invalidZeroTermsQueryParam(behavior);

        const behaviorLower = behavior.toLowerCase();
        if (behaviorLower !== 'all' && behaviorLower !== 'none') {
            invalidZeroTermsQueryParam(behavior);
        }

        this._queryOpts.zero_terms_query = behaviorLower;
        return this;
    }

    /**
     * Allows specifying an absolute or relative document frequency where high frequency
     * terms are moved into an optional subquery and are only scored if one of the
     * low frequency (below the cutoff) terms in the case of an `or` operator or
     * all of the low frequency terms in the case of an `and` operator match.
     *
     * @example
     * const qry = esb.matchQuery('message', 'to be or not to be')
     *     .cutoffFrequency(0.001);
     *
     * @param {number} frequency It can either be relative to the total number of documents
     * if in the range `[0..1)` or absolute if greater or equal to `1.0`.
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     */
    cutoffFrequency(frequency) {
        this._queryOpts.cutoff_frequency = frequency;
        return this;
    }
}

module.exports = MatchQuery;

},{"../../core":82,"../helper":129,"./mono-field-query-base":118,"lodash.isnil":183}],118:[function(require,module,exports){
'use strict';

const has = require('lodash.has');
const isNil = require('lodash.isnil');

const FullTextQueryBase = require('./full-text-query-base');

/**
 * The `MonoFieldQueryBase` provides support for common options used across
 * various full text query implementations with single search field.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} queryType
 * @param {string=} field The document field to query against
 * @param {string=} queryString The query string
 *
 * @extends FullTextQueryBase
 */
class MonoFieldQueryBase extends FullTextQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(queryType, field, queryString) {
        super(queryType, queryString);

        if (!isNil(field)) this._field = field;
    }

    /**
     * Sets the field to search on.
     *
     * @param {string} field
     * @returns {MonoFieldQueryBase} returns `this` so that calls can be chained.
     */
    field(field) {
        this._field = field;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation of the Full text query
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        // recursiveToJSON doesn't seem to be required here.

        // Revisit this.. Smells a little bit
        if (!has(this._queryOpts, 'query')) {
            throw new Error('Query string is required for full text query!');
        }

        const queryOptKeys = Object.keys(this._queryOpts);
        const qryOpts =
            queryOptKeys.length === 1 ? this._queryOpts.query : this._queryOpts;

        const repr = {
            [this.queryType]: {
                [this._field]: qryOpts
            }
        };
        return repr;
    }
}

module.exports = MonoFieldQueryBase;

},{"./full-text-query-base":112,"lodash.has":179,"lodash.isnil":183}],119:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { checkType, invalidParam },
    consts: { MULTI_MATCH_TYPE }
} = require('../../core');
const FullTextQueryBase = require('./full-text-query-base');
const { validateRewiteMethod } = require('../helper');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html';

const invalidTypeParam = invalidParam(ES_REF_URL, 'type', MULTI_MATCH_TYPE);
const invalidOperatorParam = invalidParam(
    ES_REF_URL,
    'operator',
    "'and' or 'or'"
);
const invalidBehaviorParam = invalidParam(
    ES_REF_URL,
    'behavior',
    "'all' or 'none'"
);

/**
 * A `MultiMatchQuery` query builds further on top of the
 * `MultiMatchQuery` by allowing multiple fields to be specified.
 * The idea here is to allow to more easily build a concise match type query
 * over multiple fields instead of using a relatively more expressive query
 * by using multiple match queries within a bool query.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html)
 *
 * @example
 * const qry = esb.multiMatchQuery(['subject', 'message'], 'this is a test');
 *
 * @param {Array<string>|string=} fields The fields to be queried
 * @param {string=} queryString The query string
 *
 * @extends FullTextQueryBase
 */
class MultiMatchQuery extends FullTextQueryBase {
    // Extremely similar to match query.
    // mixins are one way to go about it.
    // repeating code for now

    // eslint-disable-next-line require-jsdoc
    constructor(fields, queryString) {
        super('multi_match', queryString);

        // This field is required
        // Avoid checking for key in `this.field`
        this._queryOpts.fields = [];

        if (!isNil(fields)) {
            if (Array.isArray(fields)) this.fields(fields);
            else this.field(fields);
        }
    }

    /**
     * Appends given field to the list of fields to search against.
     * Fields can be specified with wildcards.
     * Individual fields can be boosted with the caret (^) notation.
     * Example - `"subject^3"`
     *
     * @param {string} field One of the fields to be queried
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    field(field) {
        this._queryOpts.fields.push(field);
        return this;
    }

    /**
     * Appends given fields to the list of fields to search against.
     * Fields can be specified with wildcards.
     * Individual fields can be boosted with the caret (^) notation.
     *
     * @example
     * // Boost individual fields with caret `^` notation
     * const qry = esb.multiMatchQuery(['subject^3', 'message'], 'this is a test');
     *
     * @example
     * // Specify fields with wildcards
     * const qry = esb.multiMatchQuery(['title', '*_name'], 'Will Smith');
     *
     * @param {Array<string>} fields The fields to be queried
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    fields(fields) {
        checkType(fields, Array);

        this._queryOpts.fields = this._queryOpts.fields.concat(fields);
        return this;
    }

    /**
     * Sets the type of multi match query. Valid values are:
     * - `best_fields` - (default) Finds documents which match any field,
     * but uses the `_score` from the best field.
     *
     * - `most_fields` - Finds documents which match any field and combines
     * the `_score` from each field.
     *
     * - `cross_fields` - Treats fields with the same `analyzer` as though
     * they were one big field. Looks for each word in *any* field
     *
     * - `phrase` - Runs a `match_phrase` query on each field and combines
     * the `_score` from each field.
     *
     * - `phrase_prefix` - Runs a `match_phrase_prefix` query on each field
     * and combines the `_score` from each field.
     *
     * - `bool_prefix` - (added in v7.2) Creates a match_bool_prefix query on each field and
     * combines the _score from each field.
     *
     * @example
     * // Find the single best matching field
     * const qry = esb.multiMatchQuery(['subject', 'message'], 'brown fox')
     *     .type('best_fields')
     *     .tieBreaker(0.3);
     *
     * @example
     * // Query multiple fields analyzed differently for the same text
     * const qry = esb.multiMatchQuery(
     *     ['title', 'title.original', 'title.shingles'],
     *     'quick brown fox'
     * ).type('most_fields');
     *
     * @example
     * // Run a `match_phrase_prefix` query on multiple fields
     * const qry = esb.multiMatchQuery(
     *     ['subject', 'message'],
     *     'quick brown f'
     * ).type('phrase_prefix');
     *
     * @example
     * // All terms must be present in at least one field for document to match
     * const qry = esb.multiMatchQuery(['first_name', 'last_name'], 'Will Smith')
     *     .type('cross_fields')
     *     .operator('and');
     *
     * @param {string} type Can be one of `best_fields`, `most_fields`,
     * `cross_fields`, `phrase`, `phrase_prefix` and `bool_prefix`. Default is
     * `best_fields`.
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    type(type) {
        if (isNil(type)) invalidTypeParam(type);

        const typeLower = type.toLowerCase();
        if (!MULTI_MATCH_TYPE.has(typeLower)) invalidTypeParam(type);

        this._queryOpts.type = typeLower;
        return this;
    }

    /**
     * The tie breaker value. The tie breaker capability allows results
     * that include the same term in multiple fields to be judged better than
     * results that include this term in only the best of those multiple
     * fields, without confusing this with the better case of two different
     * terms in the multiple fields. Default: `0.0`.
     *
     * @param {number} factor
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    tieBreaker(factor) {
        this._queryOpts.tie_breaker = factor;
        return this;
    }

    /**
     * The operator to be used in the boolean query which is constructed
     * by analyzing the text provided. The `operator` flag can be set to `or` or
     * `and` to control the boolean clauses (defaults to `or`).
     *
     * @param {string} operator Can be `and`/`or`. Default is `or`.
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    operator(operator) {
        if (isNil(operator)) invalidOperatorParam(operator);

        const operatorLower = operator.toLowerCase();
        if (operatorLower !== 'and' && operatorLower !== 'or') {
            invalidOperatorParam(operator);
        }

        this._queryOpts.operator = operatorLower;
        return this;
    }

    /**
     * Sets the `lenient` parameter which allows to ignore exceptions caused
     * by data-type mismatches such as trying to query a numeric field with a
     * text query string when set to `true`.
     *
     * @param {boolean} enable Defaules to `false`
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    lenient(enable) {
        this._queryOpts.lenient = enable;
        return this;
    }

    // phrase_slop is a synonym for slop.
    // haven't added method for it..

    /**
     * Configures the `slop`(default is 0) for matching terms in any order.
     * Transposed terms have a slop of 2.
     *
     * @param {number} slop A positive integer value, defaults is 0.
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    slop(slop) {
        this._queryOpts.slop = slop;
        return this;
    }

    /**
     * Sets the `fuzziness` parameter which is interpreted as a Levenshtein Edit Distance —
     * the number of one character changes that need to be made to one string to make it
     * the same as another string.
     *
     * The `fuzziness` parameter cannot be used with the `phrase`, `phrase_prefix`
     * or `cross_fields` type.
     *
     * @param {number|string} factor Can be specified either as a number, or the maximum
     * number of edits, or as `AUTO` which generates an edit distance based on the length
     * of the term.
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    fuzziness(factor) {
        this._queryOpts.fuzziness = factor;
        return this;
    }

    /**
     * Sets the prefix length for a fuzzy prefix `MultiMatchQuery`
     *
     * @param {number} len
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    prefixLength(len) {
        this._queryOpts.prefix_length = len;
        return this;
    }

    /**
     * Sets the max expansions for a fuzzy prefix `MultiMatchQuery`
     *
     * @param {number} limit
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    maxExpansions(limit) {
        this._queryOpts.max_expansions = limit;
        return this;
    }

    /**
     * Sets the rewrite method. Valid values are:
     * - `constant_score` - tries to pick the best constant-score rewrite
     *  method based on term and document counts from the query.
     *  Synonyms - `constant_score_auto`, `constant_score_filter`
     *
     * - `scoring_boolean` - translates each term into boolean should and
     *  keeps the scores as computed by the query
     *
     * - `constant_score_boolean` - same as `scoring_boolean`, expect no scores
     *  are computed.
     *
     * - `constant_score_filter` - first creates a private Filter, by visiting
     *  each term in sequence and marking all docs for that term
     *
     * - `top_terms_boost_N` - first translates each term into boolean should
     *  and scores are only computed as the boost using the top N
     *  scoring terms. Replace N with an integer value.
     *
     * - `top_terms_N` - first translates each term into boolean should
     *  and keeps the scores as computed by the query. Only the top N
     *  scoring terms are used. Replace N with an integer value.
     *
     * Default is `constant_score`.
     *
     * This is an advanced option, use with care.
     *
     * Note: The deprecated multi term rewrite parameters `constant_score_auto`,
     * `constant_score_filter` (synonyms for `constant_score`) have been removed
     * in elasticsearch 6.0.
     *
     * @param {string} method The rewrite method as a string.
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     * @throws {Error} If the given `rewrite` method is not valid.
     */
    rewrite(method) {
        validateRewiteMethod(method, 'rewrite', ES_REF_URL);

        this._queryOpts.rewrite = method;
        return this;
    }

    /**
     * Sets the fuzzy rewrite method. Valid values are:
     * - `constant_score` - tries to pick the best constant-score rewrite
     *  method based on term and document counts from the query.
     *  Synonyms - `constant_score_auto`, `constant_score_filter`
     *
     * - `scoring_boolean` - translates each term into boolean should and
     *  keeps the scores as computed by the query
     *
     * - `constant_score_boolean` - same as `scoring_boolean`, expect no scores
     *  are computed.
     *
     * - `constant_score_filter` - first creates a private Filter, by visiting
     *  each term in sequence and marking all docs for that term
     *
     * - `top_terms_boost_N` - first translates each term into boolean should
     *  and scores are only computed as the boost using the top N
     *  scoring terms. Replace N with an integer value.
     *
     * - `top_terms_N` - first translates each term into boolean should
     *  and keeps the scores as computed by the query. Only the top N
     *  scoring terms are used. Replace N with an integer value.
     *
     * Default is `constant_score`.
     *
     * This is an advanced option, use with care.
     *
     * Note: The deprecated multi term rewrite parameters `constant_score_auto`,
     * `constant_score_filter` (synonyms for `constant_score`) have been removed
     * in elasticsearch 6.0.
     *
     * @param {string} method The rewrite method as a string.
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     * @throws {Error} If the given `fuzzy_rewrite` method is not valid.
     */
    fuzzyRewrite(method) {
        validateRewiteMethod(method, 'fuzzy_rewrite', ES_REF_URL);

        this._queryOpts.fuzzy_rewrite = method;
        return this;
    }

    /**
     * If the analyzer used removes all tokens in a query like a `stop` filter does,
     * the default behavior is to match no documents at all. In order to change that
     * the `zero_terms_query` option can be used, which accepts `none` (default) and `all`
     * which corresponds to a `match_all` query.
     *
     * @param {string} behavior A no match action, `all` or `none`. Default is `none`.
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    zeroTermsQuery(behavior) {
        if (isNil(behavior)) invalidBehaviorParam(behavior);

        const behaviorLower = behavior.toLowerCase();
        if (behaviorLower !== 'all' && behaviorLower !== 'none') {
            invalidBehaviorParam(behavior);
        }

        this._queryOpts.zero_terms_query = behavior;
        return this;
    }

    /**
     * Allows specifying an absolute or relative document frequency where high frequency
     * terms are moved into an optional subquery and are only scored if one of the
     * low frequency (below the cutoff) terms in the case of an `or` operator or
     * all of the low frequency terms in the case of an `and` operator match.
     *
     * @param {number} frequency It can either be relative to the total number of documents
     * if in the range `[0..1)` or absolute if greater or equal to `1.0`.
     * @returns {MultiMatchQuery} returns `this` so that calls can be chained.
     */
    cutoffFrequency(frequency) {
        this._queryOpts.cutoff_frequency = frequency;
        return this;
    }
}

module.exports = MultiMatchQuery;

},{"../../core":82,"../helper":129,"./full-text-query-base":112,"lodash.isnil":183}],120:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { checkType, setDefault, invalidParam }
} = require('../../core');
const FullTextQueryBase = require('./full-text-query-base');

const invalidOperatorParam = invalidParam('', 'operator', "'AND' or 'OR'");

/**
 * The `QueryStringQueryBase` provides support for common options used across
 * full text query implementations `QueryStringQuery` and `SimpleQueryStringQuery`.
 * A query that uses a query parser in order to parse its content.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html)
 *
 * @param {string} queryType
 * @param {string} refUrl
 * @param {string=} queryString The actual query to be parsed.
 *
 * @extends FullTextQueryBase
 */
class QueryStringQueryBase extends FullTextQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(queryType, refUrl, queryString) {
        super(queryType, queryString);

        this._refUrl = refUrl;
    }

    /**
     * Appends given field to the list of fields to search against.
     * Fields can be specified with wildcards.
     *
     * Individual fields can be boosted with the caret (^) notation.
     * Example - `"subject^3"`
     *
     * @example
     * const qry = esb.queryStringQuery('this AND that OR thus')
     *     .field('city.*')
     *     .useDisMax(true);
     *
     * @example
     * const qry = esb.simpleQueryStringQuery('foo bar -baz').field('content');
     *
     * @param {string} field One of the fields to be queried
     * @returns {QueryStringQueryBase} returns `this` so that calls can be chained.
     */
    field(field) {
        setDefault(this._queryOpts, 'fields', []);

        this._queryOpts.fields.push(field);
        return this;
    }

    /**
     * Appends given fields to the list of fields to search against.
     * Fields can be specified with wildcards.
     *
     * Individual fields can be boosted with the caret (^) notation.
     * Example - `[ "subject^3", "message" ]`
     *
     * @example
     * const qry = esb.queryStringQuery('this AND that')
     *     .fields(['content', 'name'])
     *
     * @example
     * const qry = esb.simpleQueryStringQuery('foo bar baz')
     *     .fields(['content', 'name.*^5']);
     *
     * @param {Array<string>} fields The fields to be queried
     * @returns {QueryStringQueryBase} returns `this` so that calls can be chained.
     */
    fields(fields) {
        checkType(fields, Array);
        setDefault(this._queryOpts, 'fields', []);

        this._queryOpts.fields = this._queryOpts.fields.concat(fields);
        return this;
    }

    /**
     * The default operator used if no explicit operator is specified.
     * For example, with a default operator of `OR`, the query `capital of Hungary`
     * is translated to `capital OR of OR Hungary`, and with default operator of AND,
     * the same query is translated to `capital AND of AND Hungary`.
     * The default value is OR.
     *
     * @param {string} operator Can be `AND`/`OR`. Default is `OR`.
     * @returns {QueryStringQueryBase} returns `this` so that calls can be chained.
     */
    defaultOperator(operator) {
        if (isNil(operator)) invalidOperatorParam(operator, this._refUrl);

        const operatorUpper = operator.toUpperCase();
        if (operatorUpper !== 'AND' && operatorUpper !== 'OR') {
            invalidOperatorParam(operator, this._refUrl);
        }

        this._queryOpts.default_operator = operatorUpper;
        return this;
    }

    /**
     * By default, wildcards terms in a query string are not analyzed.
     * By setting this value to `true`, a best effort will be made to analyze those as well.
     *
     * @param {boolean} enable
     * @returns {QueryStringQueryBase} returns `this` so that calls can be chained.
     */
    analyzeWildcard(enable) {
        this._queryOpts.analyze_wildcard = enable;
        return this;
    }

    /**
     * Sets the `lenient` parameter which allows to ignore exceptions caused
     * by data-type mismatches such as trying to query a numeric field with a
     * text query string when set to `true`.
     *
     * @param {boolean} enable Defaules to `false`
     * @returns {QueryStringQueryBase} returns `this` so that calls can be chained.
     */
    lenient(enable) {
        this._queryOpts.lenient = enable;
        return this;
    }

    /**
     * A suffix to append to fields for quoted parts of the query string.
     * This allows to use a field that has a different analysis chain for exact matching.
     *
     * @param {string} suffix
     * @returns {QueryStringQueryBase} returns `this` so that calls can be chained.
     */
    quoteFieldSuffix(suffix) {
        this._queryOpts.quote_field_suffix = suffix;
        return this;
    }

    /**
     * Perform the query on all fields detected in the mapping that can be queried.
     * Will be used by default when the `_all` field is disabled and
     * no `default_field` is specified (either in the index settings or
     * in the request body) and no `fields` are specified.
     * @param {boolean} enable
     * @returns {QueryStringQueryBase} returns `this` so that calls can be chained.
     */
    allFields(enable) {
        this._queryOpts.all_fields = enable;
        return this;
    }
}

module.exports = QueryStringQueryBase;

},{"../../core":82,"./full-text-query-base":112,"lodash.isnil":183}],121:[function(require,module,exports){
'use strict';

const QueryStringQueryBase = require('./query-string-query-base');
const { validateRewiteMethod } = require('../helper');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html';

/**
 * A query that uses a query parser in order to parse its content.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html)
 *
 * @example
 * const qry = esb.queryStringQuery('this AND that OR thus')
 *     .defaultField('content');
 *
 * @param {string=} queryString The actual query to be parsed.
 *
 * @extends QueryStringQueryBase
 */
class QueryStringQuery extends QueryStringQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(queryString) {
        super('query_string', ES_REF_URL, queryString);
    }

    /**
     * The default field for query terms if no prefix field is specified.
     * Defaults to the `index.query.default_field` index settings, which
     * in turn defaults to `_all`.
     *
     * @param {string} field
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    defaultField(field) {
        this._queryOpts.default_field = field;
        return this;
    }

    /**
     * When set, `*` or `?` are allowed as the first character. Defaults to `true`.
     *
     * @param {boolean} enable
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    allowLeadingWildcard(enable) {
        this._queryOpts.allow_leading_wildcard = enable;
        return this;
    }

    /**
     * Set to true to enable position increments in result queries. Defaults to true.
     *
     * @param {boolean} enable
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    enablePositionIncrements(enable) {
        this._queryOpts.enable_position_increments = enable;
        return this;
    }

    /**
     * Controls the number of terms fuzzy queries will expand to. Defaults to `50`.
     *
     * @param {number} limit
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    fuzzyMaxExpansions(limit) {
        this._queryOpts.fuzzy_max_expansions = limit;
        return this;
    }

    /**
     * Sets the `fuzziness` parameter which is interpreted as a Levenshtein Edit Distance —
     * the number of one character changes that need to be made to one string to make it
     * the same as another string. Defaults to `AUTO`.
     *
     * @param {number|string} factor Can be specified either as a number, or the maximum
     * number of edits, or as `AUTO` which generates an edit distance based on the length
     * of the term. Defaults to `AUTO`.
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    fuzziness(factor) {
        this._queryOpts.fuzziness = factor;
        return this;
    }

    /**
     * Set the prefix length for fuzzy queries. Default is `0`.
     *
     * @param {number} len
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    fuzzyPrefixLength(len) {
        this._queryOpts.fuzzy_prefix_length = len;
        return this;
    }

    /**
     * Sets the rewrite method. Valid values are:
     * - `constant_score` - tries to pick the best constant-score rewrite
     *  method based on term and document counts from the query.
     *  Synonyms - `constant_score_auto`, `constant_score_filter`
     *
     * - `scoring_boolean` - translates each term into boolean should and
     *  keeps the scores as computed by the query
     *
     * - `constant_score_boolean` - same as `scoring_boolean`, expect no scores
     *  are computed.
     *
     * - `constant_score_filter` - first creates a private Filter, by visiting
     *  each term in sequence and marking all docs for that term
     *
     * - `top_terms_boost_N` - first translates each term into boolean should
     *  and scores are only computed as the boost using the top N
     *  scoring terms. Replace N with an integer value.
     *
     * - `top_terms_N` - first translates each term into boolean should
     *  and keeps the scores as computed by the query. Only the top N
     *  scoring terms are used. Replace N with an integer value.
     *
     * Default is `constant_score`.
     *
     * This is an advanced option, use with care.
     *
     * Note: The deprecated multi term rewrite parameters `constant_score_auto`,
     * `constant_score_filter` (synonyms for `constant_score`) have been removed
     * in elasticsearch 6.0.
     *
     * @param {string} method The rewrite method as a string.
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     * @throws {Error} If the given `rewrite` method is not valid.
     */
    rewrite(method) {
        validateRewiteMethod(method, 'rewrite', ES_REF_URL);

        this._queryOpts.rewrite = method;
        return this;
    }

    /**
     * Sets the fuzzy rewrite method. Valid values are:
     * - `constant_score` - tries to pick the best constant-score rewrite
     *  method based on term and document counts from the query.
     *  Synonyms - `constant_score_auto`, `constant_score_filter`
     *
     * - `scoring_boolean` - translates each term into boolean should and
     *  keeps the scores as computed by the query
     *
     * - `constant_score_boolean` - same as `scoring_boolean`, expect no scores
     *  are computed.
     *
     * - `constant_score_filter` - first creates a private Filter, by visiting
     *  each term in sequence and marking all docs for that term
     *
     * - `top_terms_boost_N` - first translates each term into boolean should
     *  and scores are only computed as the boost using the top N
     *  scoring terms. Replace N with an integer value.
     *
     * - `top_terms_N` - first translates each term into boolean should
     *  and keeps the scores as computed by the query. Only the top N
     *  scoring terms are used. Replace N with an integer value.
     *
     * Default is `constant_score`.
     *
     * This is an advanced option, use with care.
     *
     * Note: The deprecated multi term rewrite parameters `constant_score_auto`,
     * `constant_score_filter` (synonyms for `constant_score`) have been removed
     * in elasticsearch 6.0.
     *
     * @param {string} method The rewrite method as a string.
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     * @throws {Error} If the given `fuzzy_rewrite` method is not valid.
     */
    fuzzyRewrite(method) {
        validateRewiteMethod(method, 'fuzzy_rewrite', ES_REF_URL);

        this._queryOpts.fuzzy_rewrite = method;
        return this;
    }

    /**
     * Sets the default slop for phrases. If zero, then exact phrase matches are required.
     * Default value is 0.
     *
     * @param {number} slop A positive integer value, defaults is 0.
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    phraseSlop(slop) {
        this._queryOpts.phrase_slop = slop;
        return this;
    }

    /**
     * Auto generate phrase queries. Defaults to `false`.
     *
     * Note: This parameter has been removed in elasticsearch 6.0. If provided,
     * it will be ignored and issue a deprecation warning.
     *
     * @param {boolean} enable
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    autoGeneratePhraseQueries(enable) {
        this._queryOpts.auto_generate_phrase_queries = enable;
        return this;
    }

    /**
     * Limit on how many automaton states regexp queries are allowed to create.
     * This protects against too-difficult (e.g. exponentially hard) regexps.
     * Defaults to 10000.
     *
     * @param {number} limit
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    maxDeterminizedStates(limit) {
        this._queryOpts.max_determinized_states = limit;
        return this;
    }

    /**
     * Time Zone to be applied to any range query related to dates.
     *
     * @param {string} zone
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    timeZone(zone) {
        this._queryOpts.time_zone = zone;
        return this;
    }

    /**
     * Whether query text should be split on whitespace prior to analysis.
     * Instead the queryparser would parse around only real operators.
     * Default is `false`. It is not allowed to set this option to `false`
     * if `auto_generate_phrase_queries` is already set to `true`.
     *
     * Note: This parameter has been removed in elasticsearch 6.0. If provided,
     * it will be ignored and issue a deprecation warning. The `query_string`
     * query now splits on operator only.
     *
     * @param {string} enable
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    splitOnWhitespace(enable) {
        this._queryOpts.split_on_whitespace = enable;
        return this;
    }

    /**
     * Should the queries be combined using `dis_max` (set it to `true`),
     * or a bool query (set it to `false`). Defaults to `true`.
     *
     * Note: This parameter has been removed in elasticsearch 6.0. If provided,
     * it will be ignored and issue a deprecation warning. The `tie_breaker`
     * parameter must be used instead.
     *
     * @example
     * const qry = esb.queryStringQuery('this AND that OR thus')
     *     .fields(['content', 'name^5'])
     *     .useDisMax(true);
     *
     * @param {boolean} enable
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    useDisMax(enable) {
        this._queryOpts.use_dis_max = enable;
        return this;
    }

    /**
     * When using `dis_max`, the disjunction max tie breaker. Defaults to `0`.
     *
     * @param {number} factor
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    tieBreaker(factor) {
        this._queryOpts.tie_breaker = factor;
        return this;
    }

    /**
     * Sets the quote analyzer name used to analyze the `query`
     * when in quoted text.
     *
     * @param {string} analyzer A valid analyzer name.
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    quoteAnalyzer(analyzer) {
        this._queryOpts.quote_analyzer = analyzer;
        return this;
    }

    /**
     * If they query string should be escaped or not.
     *
     * @param {boolean} enable
     * @returns {QueryStringQuery} returns `this` so that calls can be chained.
     */
    escape(enable) {
        this._queryOpts.escape = enable;
        return this;
    }
}

module.exports = QueryStringQuery;

},{"../helper":129,"./query-string-query-base":120}],122:[function(require,module,exports){
'use strict';

const QueryStringQueryBase = require('./query-string-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html';

/**
 * A query that uses the `SimpleQueryParser` to parse its context.
 * Unlike the regular `query_string` query, the `simple_query_string` query
 * will never throw an exception, and discards invalid parts of the query.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html)
 *
 * @example
 * const qry = esb.simpleQueryStringQuery(
 *     '"fried eggs" +(eggplant | potato) -frittata'
 * )
 *     .analyzer('snowball')
 *     .fields(['body^5', '_all'])
 *     .defaultOperator('and');
 *
 * @param {string=} queryString The query string
 *
 * @extends QueryStringQueryBase
 */
class SimpleQueryStringQuery extends QueryStringQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(queryString) {
        super('simple_query_string', ES_REF_URL, queryString);
    }

    /**
     * `simple_query_string` support multiple flags to specify which parsing features
     * should be enabled. It is specified as a `|`-delimited string.
     *
     * @example
     * const qry = esb.simpleQueryStringQuery('foo | bar + baz*')
     *     .flags('OR|AND|PREFIX');
     *
     * @param {string} flags `|` delimited string. The available flags are: `ALL`, `NONE`,
     * `AND`, `OR`, `NOT`, `PREFIX`, `PHRASE`, `PRECEDENCE`, `ESCAPE`, `WHITESPACE`,
     * `FUZZY`, `NEAR`, and `SLOP`.
     * @returns {SimpleQueryStringQuery} returns `this` so that calls can be chained.
     */
    flags(flags) {
        this._queryOpts.flags = flags;
        return this;
    }
}

module.exports = SimpleQueryStringQuery;

},{"./query-string-query-base":120}],123:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    GeoPoint,
    util: { checkType, invalidParam }
} = require('../../core');

const GeoQueryBase = require('./geo-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-query.html';

const invalidTypeParam = invalidParam(
    ES_REF_URL,
    'type',
    "'memory' or 'indexed'"
);

/**
 * A query allowing to filter hits based on a point location using a bounding box.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-query.html)
 *
 * @example
 * // Format of point in Geohash
 * const qry = esb.geoBoundingBoxQuery('pin.location')
 *     .topLeft(esb.geoPoint().string('dr5r9ydj2y73'))
 *     .bottomRight(esb.geoPoint().string('drj7teegpus6'));
 *
 * @example
 * // Format of point with lat lon as properties
 * const qry = esb.geoBoundingBoxQuery()
 *     .field('pin.location')
 *     .topLeft(esb.geoPoint()
 *         .lat(40.73)
 *         .lon(-74.1))
 *     .bottomRight(esb.geoPoint()
 *         .lat(40.10)
 *         .lon(-71.12));
 *
 * @example
 * // Set bounding box values separately
 * const qry = esb.geoBoundingBoxQuery('pin.location')
 *     .top(40.73)
 *     .left(-74.1)
 *     .bottom(40.01)
 *     .right(-71.12);
 *
 * @param {string=} field
 *
 * @extends GeoQueryBase
 */
class GeoBoundingBoxQuery extends GeoQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field) {
        super('geo_bounding_box', field);
    }

    /**
     * Sets the top left coordinate for the Geo bounding box filter for
     * querying documents
     *
     * @param {GeoPoint} point A valid `GeoPoint`
     * @returns {GeoBoundingBoxQuery} returns `this` so that calls can be chained.
     */
    topLeft(point) {
        checkType(point, GeoPoint);

        this._fieldOpts.top_left = point;
        return this;
    }

    /**
     * Sets the bottom right coordinate for the Geo bounding box filter for
     * querying documents
     *
     * @param {GeoPoint} point A valid `GeoPoint`
     * @returns {GeoBoundingBoxQuery} returns `this` so that calls can be chained.
     */
    bottomRight(point) {
        checkType(point, GeoPoint);

        this._fieldOpts.bottom_right = point;
        return this;
    }

    /**
     * Sets the top right coordinate for the Geo bounding box filter for
     * querying documents
     *
     * @param {GeoPoint} point A valid `GeoPoint`
     * @returns {GeoBoundingBoxQuery} returns `this` so that calls can be chained.
     */
    topRight(point) {
        checkType(point, GeoPoint);

        this._fieldOpts.top_right = point;
        return this;
    }

    /**
     * Sets the bottom left coordinate for the Geo bounding box filter for
     * querying documents
     *
     * @param {GeoPoint} point A valid `GeoPoint`
     * @returns {GeoBoundingBoxQuery} returns `this` so that calls can be chained.
     */
    bottomLeft(point) {
        checkType(point, GeoPoint);

        this._fieldOpts.bottom_left = point;
        return this;
    }

    /**
     * Sets value for top of the bounding box.
     *
     * @param {number} val
     * @returns {GeoBoundingBoxQuery} returns `this` so that calls can be chained.
     */
    top(val) {
        this._fieldOpts.top = val;
        return this;
    }

    /**
     * Sets value for left of the bounding box.
     *
     * @param {number} val
     * @returns {GeoBoundingBoxQuery} returns `this` so that calls can be chained.
     */
    left(val) {
        this._fieldOpts.left = val;
        return this;
    }

    /**
     * Sets value for bottom of the bounding box.
     *
     * @param {number} val
     * @returns {GeoBoundingBoxQuery} returns `this` so that calls can be chained.
     */
    bottom(val) {
        this._fieldOpts.bottom = val;
        return this;
    }

    /**
     * Sets value for right of the bounding box.
     *
     * @param {number} val
     * @returns {GeoBoundingBoxQuery} returns `this` so that calls can be chained.
     */
    right(val) {
        this._fieldOpts.right = val;
        return this;
    }

    /**
     * Sets the type of execution for the bounding box query.
     * The type of the bounding box execution by default is set to memory,
     * which means in memory checks if the doc falls within the bounding
     * box range. In some cases, an indexed option will perform faster
     * (but note that the geo_point type must have lat and lon indexed in this case)
     *
     * @example
     *
     * const geoQry = esb.geoBoundingBoxQuery()
     *     .field('pin.location')
     *     .topLeft(esb.geoPoint()
     *         .lat(40.73)
     *         .lon(-74.1))
     *     .bottomRight(esb.geoPoint()
     *         .lat(40.10)
     *         .lon(-71.12))
     *     .type('indexed');
     *
     * @param {string} type Can either `memory` or `indexed`
     * @returns {GeoBoundingBoxQuery} returns `this` so that calls can be chained.
     */
    type(type) {
        if (isNil(type)) invalidTypeParam(type);

        const typeLower = type.toLowerCase();
        if (typeLower !== 'memory' && typeLower !== 'indexed') {
            invalidTypeParam(type);
        }

        this._queryOpts.type = typeLower;
        return this;
    }
}

module.exports = GeoBoundingBoxQuery;

},{"../../core":82,"./geo-query-base":126,"lodash.isnil":183}],124:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    GeoPoint,
    util: { checkType, invalidParam }
} = require('../../core');

const GeoQueryBase = require('./geo-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html';

const invalidDistanceTypeParam = invalidParam(
    ES_REF_URL,
    'distance_type',
    "'plane' or 'arc'"
);

/**
 * Filters documents that include only hits that exists within a specific distance from a geo point.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html)
 *
 * @example
 * const qry = esb.geoDistanceQuery('pin.location', esb.geoPoint().lat(40).lon(-70))
 *     .distance('12km');
 *
 * const qry = esb.geoDistanceQuery()
 *     .field('pin.location')
 *     .distance('200km')
 *     .geoPoint(esb.geoPoint().lat(40).lon(-70));
 *
 * @param {string=} field
 * @param {GeoPoint=} point Geo point used to measure and filter documents based on distance from it.
 *
 * @extends GeoQueryBase
 */
class GeoDistanceQuery extends GeoQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field, point) {
        super('geo_distance', field);

        if (!isNil(point)) this.geoPoint(point);
    }

    /**
     * Sets the radius of the circle centred on the specified location. Points which
     * fall into this circle are considered to be matches. The distance can be specified
     * in various units.
     *
     * @param {string|number} distance Radius of circle centred on specified location.
     * @returns {GeoDistanceQuery} returns `this` so that calls can be chained.
     */
    distance(distance) {
        this._queryOpts.distance = distance;
        return this;
    }

    /**
     * Sets the distance calculation mode, `arc` or `plane`.
     * The `arc` calculation is the more accurate.
     * The `plane` is the faster but least accurate.
     *
     * @param {string} type
     * @returns {GeoDistanceQuery} returns `this` so that calls can be chained
     * @throws {Error} If `type` is neither `plane` nor `arc`.
     */
    distanceType(type) {
        if (isNil(type)) invalidDistanceTypeParam(type);

        const typeLower = type.toLowerCase();
        if (typeLower !== 'plane' && typeLower !== 'arc')
            invalidDistanceTypeParam(type);

        this._queryOpts.distance_type = typeLower;
        return this;
    }

    /**
     * Sets the point to filter documents based on the distance from it.
     *
     * @param {GeoPoint} point Geo point used to measure and filter documents based on distance from it.
     * @returns {GeoDistanceQuery} returns `this` so that calls can be chained
     * @throws {TypeError} If parameter `point` is not an instance of `GeoPoint`
     */
    geoPoint(point) {
        checkType(point, GeoPoint);

        this._fieldOpts = point;
        return this;
    }
}

module.exports = GeoDistanceQuery;

},{"../../core":82,"./geo-query-base":126,"lodash.isnil":183}],125:[function(require,module,exports){
'use strict';

const {
    util: { checkType }
} = require('../../core');

const GeoQueryBase = require('./geo-query-base');

/**
 * A query allowing to include hits that only fall within a polygon of points.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-polygon-query.html)
 *
 * @example
 * const geoQry = esb.geoPolygonQuery('person.location')
 *     .points([
 *         {"lat" : 40, "lon" : -70},
 *         {"lat" : 30, "lon" : -80},
 *         {"lat" : 20, "lon" : -90}
 *     ]);
 *
 * @param {string=} field
 *
 * @extends GeoQueryBase
 */
class GeoPolygonQuery extends GeoQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field) {
        super('geo_polygon', field);
    }

    /**
     * Sets the points which form the polygon.
     * Points can be instances of `GeoPoint`, Object with `lat`, `lon` keys,
     * `GeoJSON` array representation or string(`geohash`/`lat, lon`)
     *
     * @example
     * // Format in `[lon, lat]`
     * const qry = esb.geoPolygonQuery('person.location').points([
     *     [-70, 40],
     *     [-80, 30],
     *     [-90, 20]
     * ]);
     *
     * @example
     * // Format in lat,lon
     * const qry = esb.geoPolygonQuery('person.location').points([
     *     '40, -70',
     *     '30, -80',
     *     '20, -90'
     * ]);
     *
     * @example
     * // Geohash
     * const qry = esb.geoPolygonQuery('person.location').points([
     *     'drn5x1g8cu2y',
     *     '30, -80',
     *     '20, -90'
     * ]);
     *
     * @param {Array<*>} points
     * @returns {GeoPolygonQuery} returns `this` so that calls can be chained
     * @throws {TypeError} If `points` parameter is not an instance of `Array`.
     */
    points(points) {
        checkType(points, Array);

        this._fieldOpts.points = points;
        return this;
    }
}

module.exports = GeoPolygonQuery;

},{"../../core":82,"./geo-query-base":126}],126:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Query,
    util: { invalidParam, recursiveToJSON }
} = require('../../core');

const invalidValidationMethod = invalidParam(
    '',
    'validation_method',
    "'IGNORE_MALFORMED', 'COERCE' or 'STRICT'"
);

/**
 * The `GeoQueryBase` provides support for common options used across
 * various geo query implementations.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} queryType
 * @param {string=} field
 *
 * @extends Query
 */
class GeoQueryBase extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(queryType, field) {
        super(queryType);

        this._field = null;
        this._fieldOpts = {};

        if (!isNil(field)) this._field = field;
    }

    /**
     * Sets the field to run the geo query on.
     *
     * @param {string} field
     * @returns {GeoQueryBase} returns `this` so that calls can be chained.
     */
    field(field) {
        this._field = field;
        return this;
    }

    /**
     * Sets the `validation_method` parameter. Can be set to `IGNORE_MALFORMED` to accept
     * geo points with invalid latitude or longitude, `COERCE` to try and infer correct latitude
     * or longitude, or `STRICT` (default is `STRICT`).
     *
     * Note: The `ignore_malformed` and `coerce` parameters have been removed
     * from `geo_bounding_box`, `geo_polygon`, and `geo_distance` queries in
     * elasticsearch 6.0.
     *
     * @param {string} method One of `IGNORE_MALFORMED`, `COERCE` or `STRICT`(default)
     * @returns {GeoQueryBase} returns `this` so that calls can be chained.
     * @throws {Error} If `method` parameter is not one of `IGNORE_MALFORMED`, `COERCE` or `STRICT`
     */
    validationMethod(method) {
        if (isNil(method)) invalidValidationMethod(method);

        const methodUpper = method.toUpperCase();
        if (
            methodUpper !== 'IGNORE_MALFORMED' &&
            methodUpper !== 'COERCE' &&
            methodUpper !== 'STRICT'
        ) {
            invalidValidationMethod(method);
        }

        this._queryOpts.validation_method = methodUpper;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation of the geo query
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        return recursiveToJSON({
            [this.queryType]: Object.assign(
                { [this._field]: this._fieldOpts },
                this._queryOpts
            )
        });
    }
}

module.exports = GeoQueryBase;

},{"../../core":82,"lodash.isnil":183}],127:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    GeoShape,
    IndexedShape,
    util: { checkType, invalidParam },
    consts: { GEO_RELATION_SET }
} = require('../../core');

const GeoQueryBase = require('./geo-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-shape-query.html';

const invalidRelationParam = invalidParam(
    ES_REF_URL,
    'relation',
    GEO_RELATION_SET
);

/**
 * Filter documents indexed using the `geo_shape` type. Requires
 * the `geo_shape` Mapping.
 *
 * The `geo_shape` query uses the same grid square representation as
 * the `geo_shape` mapping to find documents that have a shape that
 * intersects with the query shape. It will also use the same PrefixTree
 * configuration as defined for the field mapping.
 *
 * The query supports two ways of defining the query shape, either by
 * providing a whole shape definition, or by referencing the name of
 * a shape pre-indexed in another index.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-shape-query.html)
 *
 * @example
 * const geoQry = esb.geoShapeQuery('location')
 *     .shape(esb.geoShape()
 *         .type('envelope')
 *         .coordinates([[13.0, 53.0], [14.0, 52.0]]))
 *     .relation('within');
 *
 * @example
 * // Pre-indexed shape
 * const geoQry = esb.geoShapeQuery()
 *     .field('location')
 *     .indexedShape(esb.indexedShape()
 *         .id('DEU')
 *         .type('countries')
 *         .index('shapes')
 *         .path('location'))
 *
 * @param {string=} field
 *
 * @extends GeoQueryBase
 */
class GeoShapeQuery extends GeoQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field) {
        super('geo_shape', field);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on GeoShapeQuery
     */
    validationMethod() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('validationMethod is not supported in GeoShapeQuery');
    }

    /**
     * Sets the shape definition for the geo query.
     *
     * @param {GeoShape} shape
     * @returns {GeoShapeQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If given `shape` is not an instance of `GeoShape`
     */
    shape(shape) {
        checkType(shape, GeoShape);

        this._fieldOpts.shape = shape;
        return this;
    }

    /**
     * Sets the reference name of a shape pre-indexed in another index.
     *
     * @param {IndexedShape} shape
     * @returns {GeoShapeQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If given `shape` is not an instance of `IndexedShape`
     */
    indexedShape(shape) {
        checkType(shape, IndexedShape);

        this._fieldOpts.indexed_shape = shape;
        return this;
    }

    /**
     * Sets the relationship between Query and indexed data
     * that will be used to determine if a Document should be matched or not.
     *
     * @param {string} relation Can be one of `WITHIN`, `CONTAINS`, `DISJOINT`
     * or `INTERSECTS`(default)
     * @returns {GeoShapeQuery} returns `this` so that calls can be chained
     */
    relation(relation) {
        if (isNil(relation)) invalidRelationParam(relation);

        const relationUpper = relation.toUpperCase();
        if (!GEO_RELATION_SET.has(relationUpper)) {
            invalidRelationParam(relation);
        }

        this._fieldOpts.relation = relationUpper;
        return this;
    }

    /**
     * When set to `true` will ignore an unmapped `path` and will not match any
     * documents for this query. When set to `false` (the default value) the query
     * will throw an exception if the path is not mapped.
     *
     * @param {boolean} enable `true` or `false`, `false` by default.
     * @returns {GeoShapeQuery} returns `this` so that calls can be chained.
     */
    ignoreUnmapped(enable) {
        this._queryOpts.ignore_unmapped = enable;
        return this;
    }
}

module.exports = GeoShapeQuery;

},{"../../core":82,"./geo-query-base":126,"lodash.isnil":183}],128:[function(require,module,exports){
'use strict';

exports.GeoQueryBase = require('./geo-query-base');

exports.GeoShapeQuery = require('./geo-shape-query');
exports.GeoBoundingBoxQuery = require('./geo-bounding-box-query');
exports.GeoDistanceQuery = require('./geo-distance-query');
exports.GeoPolygonQuery = require('./geo-polygon-query');

},{"./geo-bounding-box-query":123,"./geo-distance-query":124,"./geo-polygon-query":125,"./geo-query-base":126,"./geo-shape-query":127}],129:[function(require,module,exports){
'use strict';

const { inspect } = require('../core/inspect');

const {
    util: { firstDigitPos },
    consts: { REWRITE_METHOD_SET }
} = require('../core');

/**
 * Validate the rewrite method.
 *
 * @private
 * @param {string} method
 * @param {string} paramName
 * @param {string} refUrl
 * @throws {Error} If the given rewrite method is not valid.
 */
exports.validateRewiteMethod = function validateRewiteMethod(
    method,
    paramName,
    refUrl
) {
    // NOTE: This does not check for lower case comparison.
    if (!REWRITE_METHOD_SET.has(method)) {
        const rewriteMethodName = `${method.substring(
            0,
            firstDigitPos(method)
        )}N`;
        if (!REWRITE_METHOD_SET.has(rewriteMethodName)) {
            console.log(`See ${refUrl}`);
            console.warn(`Got '${paramName}' - ${method}`);
            throw new Error(
                `The '${paramName}' parameter should belong to ${inspect(
                    REWRITE_METHOD_SET
                )}`
            );
        }
    }
};

},{"../core":82,"../core/inspect":85}],130:[function(require,module,exports){
'use strict';

exports.MatchAllQuery = require('./match-all-query');
exports.MatchNoneQuery = require('./match-none-query');

exports.fullTextQueries = require('./full-text-queries');

exports.termLevelQueries = require('./term-level-queries');

exports.compoundQueries = require('./compound-queries');

exports.joiningQueries = require('./joining-queries');

exports.geoQueries = require('./geo-queries');

exports.specializedQueries = require('./specialized-queries');

exports.spanQueries = require('./span-queries');

},{"./compound-queries":102,"./full-text-queries":113,"./geo-queries":128,"./joining-queries":133,"./match-all-query":137,"./match-none-query":138,"./span-queries":139,"./specialized-queries":152,"./term-level-queries":161}],131:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const JoiningQueryBase = require('./joining-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-child-query.html';

/**
 * The `has_child` filter accepts a query and the child type to run against, and
 * results in parent documents that have child docs matching the query.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-child-query.html)
 *
 * @example
 * // Scoring support
 * const qry = esb.hasChildQuery(
 *     esb.termQuery('tag', 'something'),
 *     'blog_tag'
 * ).scoreMode('min');
 *
 * @example
 * // Sort by child documents' `click_count` field
 * const qry = esb.hasChildQuery()
 *     .query(
 *         esb.functionScoreQuery().function(
 *             esb.scriptScoreFunction("_score * doc['click_count'].value")
 *         )
 *     )
 *     .type('blog_tag')
 *     .scoreMode('max');
 *
 * @param {Query=} qry A valid `Query` object
 * @param {string=} type The child type
 *
 * @extends JoiningQueryBase
 */
class HasChildQuery extends JoiningQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(qry, type) {
        super('has_child', ES_REF_URL, qry);

        if (!isNil(type)) this._queryOpts.type = type;
    }

    /**
     * Sets the child document type to search against.
     * Alias for method `childType`.
     *
     * @param {string} type A valid doc type name
     * @returns {HasChildQuery} returns `this` so that calls can be chained.
     */
    type(type) {
        this._queryOpts.type = type;
        return this;
    }

    /**
     * Sets the child document type to search against
     *
     * @param {string} type A valid doc type name
     * @returns {HasChildQuery} returns `this` so that calls can be chained.
     */
    childType(type) {
        console.warn(
            '[HasChildQuery] Field `child_type` is deprecated. Use `type` instead.'
        );
        return this.type(type);
    }

    /**
     * Specify the minimum number of children are required to match
     * for the parent doc to be considered a match
     *
     * @example
     * const qry = esb.hasChildQuery(esb.termQuery('tag', 'something'), 'blog_tag')
     *     .minChildren(2)
     *     .maxChildren(10)
     *     .scoreMode('min');
     *
     * @param {number} limit A positive `integer` value.
     * @returns {HasChildQuery} returns `this` so that calls can be chained.
     */
    minChildren(limit) {
        this._queryOpts.min_children = limit;
        return this;
    }

    /**
     * Specify the maximum number of children are required to match
     * for the parent doc to be considered a match
     *
     * @example
     * const qry = esb.hasChildQuery(esb.termQuery('tag', 'something'), 'blog_tag')
     *     .minChildren(2)
     *     .maxChildren(10)
     *     .scoreMode('min');
     *
     * @param {number} limit A positive `integer` value.
     * @returns {HasChildQuery} returns `this` so that calls can be chained.
     */
    maxChildren(limit) {
        this._queryOpts.max_children = limit;
        return this;
    }
}

module.exports = HasChildQuery;

},{"./joining-query-base":134,"lodash.isnil":183}],132:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const JoiningQueryBase = require('./joining-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-parent-query.html';

/**
 * The `has_parent` query accepts a query and a parent type. The query is
 * executed in the parent document space, which is specified by the parent
 * type. This query returns child documents which associated parents have
 * matched.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-parent-query.html)
 *
 * @example
 * const qry = esb.hasParentQuery(esb.termQuery('tag', 'something'), 'blog');
 *
 * @example
 * // Sorting tags by parent documents' `view_count` field
 * const qry = esb.hasParentQuery()
 *     .parentType('blog')
 *     .score(true)
 *     .query(
 *         esb.functionScoreQuery().function(
 *             esb.scriptScoreFunction("_score * doc['view_count'].value")
 *         )
 *     );
 *
 * @param {Query=} qry A valid `Query` object
 * @param {string=} type The parent type
 *
 * @extends JoiningQueryBase
 */
class HasParentQuery extends JoiningQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(qry, type) {
        super('has_parent', ES_REF_URL, qry);

        if (!isNil(type)) this._queryOpts.parent_type = type;
    }

    /**
     * @throws {Error} `score_mode` is deprecated. Use `score` instead.
     * @override
     */
    scoreMode() {
        console.log('`score_mode` is deprecated. Use `score` instead');
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('scoreMode is not supported in HasParentQuery');
    }

    /**
     * Sets the child document type to search against
     * Alias for method `parentType`
     *
     * @param {string} type A valid doc type name
     * @returns {HasParentQuery} returns `this` so that calls can be chained.
     */
    type(type) {
        return this.parentType(type);
    }

    /**
     * Sets the child document type to search against
     *
     * @param {string} type A valid doc type name
     * @returns {HasParentQuery} returns `this` so that calls can be chained.
     */
    parentType(type) {
        this._queryOpts.parent_type = type;
        return this;
    }

    /**
     * By default, scoring is `false` which ignores the score from the parent document.
     * The score is in this case equal to the boost on the `has_parent` query (Defaults to 1).
     * If the score is set to `true`, then the score of the matching parent document is
     * aggregated into the child documents belonging to the matching parent document.
     *
     * @example
     * const qry = esb.hasParentQuery(
     *     esb.termQuery('tag', 'something'),
     *     'blog'
     * ).score(true);
     *
     * @param {boolean} enable `true` to enable scoring, `false` to disable.
     * `false` by default.
     * @returns {HasParentQuery} returns `this` so that calls can be chained.
     */
    score(enable) {
        this._queryOpts.score = enable;
        return this;
    }
}

module.exports = HasParentQuery;

},{"./joining-query-base":134,"lodash.isnil":183}],133:[function(require,module,exports){
'use strict';

exports.JoiningQueryBase = require('./joining-query-base');

exports.NestedQuery = require('./nested-query');
exports.HasChildQuery = require('./has-child-query');
exports.HasParentQuery = require('./has-parent-query');
exports.ParentIdQuery = require('./parent-id-query');

},{"./has-child-query":131,"./has-parent-query":132,"./joining-query-base":134,"./nested-query":135,"./parent-id-query":136}],134:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Query,
    InnerHits,
    util: { checkType, invalidParam },
    consts: { NESTED_SCORE_MODE_SET }
} = require('../../core');

const invalidScoreModeParam = invalidParam(
    '',
    'score_mode',
    NESTED_SCORE_MODE_SET
);
/**
 * The `JoiningQueryBase` class provides support for common options used across
 * various joining query implementations.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} queryType
 * @param {string} refUrl
 * @param {Query=} qry A valid `Query` object
 *
 * @extends Query
 */
class JoiningQueryBase extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(queryType, refUrl, qry) {
        super(queryType);
        this.refUrl = refUrl;

        if (!isNil(qry)) this.query(qry);
    }

    /**
     * Sets the nested query to be executed.
     *
     * @param {Query} qry A valid `Query` object
     * @returns {JoiningQueryBase} returns `this` so that calls can be chained.
     */
    query(qry) {
        checkType(qry, Query);

        this._queryOpts.query = qry;
        return this;
    }

    /**
     * Sets the scoring method.
     *
     * Valid values are:
     * - `none` - no scoring
     * - `max` - the highest score of all matched child documents is used
     * - `min` - the lowest score of all matched child documents is used
     * - `sum` - the sum the all the matched child documents is used
     * - `avg` - the default, the average of all matched child documents is used
     *
     * @example
     * const qry = esb.hasChildQuery(
     *     esb.termQuery('tag', 'something'),
     *     'blog_tag'
     * ).scoreMode('min');
     *
     * @param {string} mode Can be one of `none`, `sum`, `min`, `max`, `avg`.
     * Defaults to `avg` for `NestedQuery`, `none` for `HasChildQuery`.
     * @returns {JoiningQueryBase} returns `this` so that calls can be chained.
     */
    scoreMode(mode) {
        if (isNil(mode)) invalidScoreModeParam(mode);

        const modeLower = mode.toLowerCase();
        if (!NESTED_SCORE_MODE_SET.has(modeLower)) {
            invalidScoreModeParam(mode);
        }

        this._queryOpts.score_mode = modeLower;
        return this;
    }

    /**
     * When set to `true` will ignore an unmapped `path` and will not match any
     * documents for this query. When set to `false` (the default value) the query
     * will throw an exception if the path is not mapped.
     *
     * @param {boolean} enable `true` or `false`, `false` by default.
     * @returns {JoiningQueryBase} returns `this` so that calls can be chained.
     */
    ignoreUnmapped(enable) {
        this._queryOpts.ignore_unmapped = enable;
        return this;
    }

    /**
     * Sets the inner hits options
     *
     * @param {InnerHits} innerHits A valid `InnerHits` object
     * @returns {JoiningQueryBase} returns `this` so that calls can be chained.
     */
    innerHits(innerHits) {
        checkType(innerHits, InnerHits);

        this._queryOpts.inner_hits = innerHits;
        return this;
    }
}

module.exports = JoiningQueryBase;

},{"../../core":82,"lodash.isnil":183}],135:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const JoiningQueryBase = require('./joining-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-nested-query.html';

/**
 * Nested query allows to query nested objects. The query is executed against
 * the nested objects / docs as if they were indexed as separate docs
 * (they are, internally) and resulting in the root parent doc (or parent nested mapping).
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-nested-query.html)
 *
 * @example
 * const qry = esb.nestedQuery()
 *     .path('obj1')
 *     .scoreMode('avg')
 *     .query(
 *         esb.boolQuery().must([
 *             esb.matchQuery('obj1.name', 'blue'),
 *             esb.rangeQuery('obj1.count').gt(5)
 *         ])
 *     );
 *
 * @param {Query=} qry A valid `Query` object
 * @param {string=} path The nested object path.
 *
 * @extends JoiningQueryBase
 */
class NestedQuery extends JoiningQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(qry, path) {
        super('nested', ES_REF_URL, qry);

        if (!isNil(path)) this._queryOpts.path = path;
    }

    /**
     * Sets the root context for the nested query.
     *
     * @param {string} path
     * @returns {NestedQuery} returns `this` so that calls can be chained.
     */
    path(path) {
        this._queryOpts.path = path;
        return this;
    }
}

module.exports = NestedQuery;

},{"./joining-query-base":134,"lodash.isnil":183}],136:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const { Query } = require('../../core');

/**
 * The `parent_id` query can be used to find child documents which belong to a particular parent.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-parent-id-query.html)
 *
 * @example
 * const qry = esb.parentIdQuery('blog_tag', 1);
 *
 * @param {string=} type The **child** type. This must be a type with `_parent` field.
 * @param {string|number=} id The required parent id select documents must refer to.
 *
 * @extends Query
 */
class ParentIdQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(type, id) {
        super('parent_id');

        if (!isNil(type)) this._queryOpts.type = type;
        if (!isNil(id)) this._queryOpts.id = id;
    }

    /**
     * Sets the child type.
     *
     * @param {string} type The **child** type. This must be a type with `_parent` field.
     * @returns {ParentIdQuery} returns `this` so that calls can be chained.
     */
    type(type) {
        this._queryOpts.type = type;
        return this;
    }

    /**
     * Sets the id.
     *
     * @param {string|number} id The required parent id select documents must refer to.
     * @returns {ParentIdQuery} returns `this` so that calls can be chained.
     */
    id(id) {
        this._queryOpts.id = id;
        return this;
    }

    /**
     * When set to `true` will ignore an unmapped `path` and will not match any
     * documents for this query. When set to `false` (the default value) the query
     * will throw an exception if the path is not mapped.
     *
     * @param {boolean} enable `true` or `false`, `false` by default.
     * @returns {ParentIdQuery} returns `this` so that calls can be chained.
     */
    ignoreUnmapped(enable) {
        this._queryOpts.ignore_unmapped = enable;
        return this;
    }
}

module.exports = ParentIdQuery;

},{"../../core":82,"lodash.isnil":183}],137:[function(require,module,exports){
'use strict';

const { Query } = require('../core');

/**
 * The most simple query, which matches all documents, giving them all a `_score` of `1.0`.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-all-query.html)
 *
 * @example
 * const qry = esb.matchAllQuery().boost(1.2);
 *
 * @extends Query
 */
class MatchAllQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('match_all');
    }
}

module.exports = MatchAllQuery;

},{"../core":82}],138:[function(require,module,exports){
'use strict';

const { Query } = require('../core');

/**
 * The inverse of the `match_all` query, which matches no documents.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-all-query.html)
 *
 * @example
 * const qry = esb.matchNoneQuery();
 *
 * @extends Query
 */
class MatchNoneQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('match_none');
    }
}

module.exports = MatchNoneQuery;

},{"../core":82}],139:[function(require,module,exports){
'use strict';

exports.SpanLittleBigQueryBase = require('./span-little-big-query-base');

exports.SpanTermQuery = require('./span-term-query');
exports.SpanMultiTermQuery = require('./span-multi-term-query');
exports.SpanFirstQuery = require('./span-first-query');
exports.SpanNearQuery = require('./span-near-query');
exports.SpanOrQuery = require('./span-or-query');
exports.SpanNotQuery = require('./span-not-query');
exports.SpanContainingQuery = require('./span-containing-query');
exports.SpanWithinQuery = require('./span-within-query');
exports.SpanFieldMaskingQuery = require('./span-field-masking-query');

},{"./span-containing-query":140,"./span-field-masking-query":141,"./span-first-query":142,"./span-little-big-query-base":143,"./span-multi-term-query":144,"./span-near-query":145,"./span-not-query":146,"./span-or-query":147,"./span-term-query":149,"./span-within-query":150}],140:[function(require,module,exports){
'use strict';

const SpanLittleBigQueryBase = require('./span-little-big-query-base');

/**
 * Returns matches which enclose another span query. The span containing query
 * maps to Lucene `SpanContainingQuery`.
 *
 * Matching spans from big that contain matches from little are returned.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-containing-query.html)
 *
 * @example
 * const spanQry = esb.spanContainingQuery()
 *     .little(esb.spanTermQuery('field1', 'foo'))
 *     .big(esb.spanNearQuery()
 *         .clauses([
 *             esb.spanTermQuery('field1', 'bar'),
 *             esb.spanTermQuery('field1', 'baz')
 *         ])
 *         .slop(5)
 *         .inOrder(true))
 *
 * @extends SpanLittleBigQueryBase
 */
class SpanContainingQuery extends SpanLittleBigQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('span_containing');
    }
}

module.exports = SpanContainingQuery;

},{"./span-little-big-query-base":143}],141:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { checkType }
} = require('../../core');

const SpanQueryBase = require('./span-query-base');

/**
 * Wrapper to allow span queries to participate in composite single-field
 * span queries by lying about their search field. The span field masking
 * query maps to Lucene's `SpanFieldMaskingQuery`.
 *
 * This can be used to support queries like span-near or span-or across
 * different fields, which is not ordinarily permitted.
 *
 * Span field masking query is invaluable in conjunction with multi-fields
 * when same content is indexed with multiple analyzers. For instance we
 * could index a field with the standard analyzer which breaks text up into
 * words, and again with the english analyzer which stems words into their root form.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-field-masking-query.html)
 *
 * @param {string=} field
 * @param {SpanQueryBase=} spanQry Any other span type query
 *
 * @example
 * const spanQry = esb.spanNearQuery()
 *     .clauses([
 *         esb.spanTermQuery('text', 'quick brown'),
 *         esb.spanFieldMaskingQuery()
 *             .field('text')
 *             .query(esb.spanTermQuery('text.stems', 'fox'))
 *     ])
 *     .slop(5)
 *     .inOrder(false);
 *
 * @extends SpanQueryBase
 */
class SpanFieldMaskingQuery extends SpanQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field, spanQry) {
        super('field_masking_span');

        if (!isNil(field)) this._queryOpts.field = field;
        if (!isNil(spanQry)) this.query(spanQry);
    }

    /**
     * Sets the span query.
     *
     * @param {SpanQueryBase} spanQry
     * @returns {SpanFieldMaskingQuery} returns `this` so that calls can be chained.
     */
    query(spanQry) {
        checkType(spanQry, SpanQueryBase);

        this._queryOpts.query = spanQry;
        return this;
    }

    /**
     * Sets the field to mask.
     *
     * @param {string} field
     * @returns {SpanFieldMaskingQuery} returns `this` so that calls can be chained.
     */
    field(field) {
        this._queryOpts.field = field;
        return this;
    }
}

module.exports = SpanFieldMaskingQuery;

},{"../../core":82,"./span-query-base":148,"lodash.isnil":183}],142:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { checkType }
} = require('../../core');

const SpanQueryBase = require('./span-query-base');

/**
 * Matches spans near the beginning of a field. The span first query maps to Lucene `SpanFirstQuery`.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-first-query.html)
 *
 * @example
 * const spanQry = esb.spanFirstQuery()
 *     .match(esb.spanTermQuery('user', 'kimchy'))
 *     .end(3);
 *
 * @param {SpanQueryBase=} spanQry Any other span type query
 *
 * @extends SpanQueryBase
 */
class SpanFirstQuery extends SpanQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(spanQry) {
        super('span_first');

        if (!isNil(spanQry)) this.match(spanQry);
    }

    /**
     * Sets the `match` clause which can be any other span type query.
     *
     * @param {SpanQueryBase} spanQry
     * @returns {SpanFirstQuery} returns `this` so that calls can be chained.
     */
    match(spanQry) {
        checkType(spanQry, SpanQueryBase);

        this._queryOpts.match = spanQry;
        return this;
    }

    /**
     * Sets the maximum end position permitted in a match.
     *
     * @param {number} limit The maximum end position permitted in a match.
     * @returns {SpanFirstQuery} returns `this` so that calls can be chained.
     */
    end(limit) {
        this._queryOpts.end = limit;
        return this;
    }
}

module.exports = SpanFirstQuery;

},{"../../core":82,"./span-query-base":148,"lodash.isnil":183}],143:[function(require,module,exports){
'use strict';

const {
    util: { checkType }
} = require('../../core');

const SpanQueryBase = require('./span-query-base');

/**
 * Base class for span queries with `little`, `big` clauses.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @extends SpanQueryBase
 */
class SpanLittleBigQueryBase extends SpanQueryBase {
    /**
     * Sets the `little` clause.
     *
     * @param {SpanQueryBase} spanQry Any span type query
     * @returns {SpanLittleBigQueryBase} returns `this` so that calls can be chained.
     */
    little(spanQry) {
        checkType(spanQry, SpanQueryBase);

        this._queryOpts.little = spanQry;
        return this;
    }

    /**
     * Sets the `big` clause.
     *
     * @param {SpanQueryBase} spanQry Any span type query
     * @returns {SpanLittleBigQueryBase} returns `this` so that calls can be chained.
     */
    big(spanQry) {
        checkType(spanQry, SpanQueryBase);

        this._queryOpts.big = spanQry;
        return this;
    }
}

module.exports = SpanLittleBigQueryBase;

},{"../../core":82,"./span-query-base":148}],144:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { checkType }
} = require('../../core');

const { MultiTermQueryBase } = require('../term-level-queries');

const SpanQueryBase = require('./span-query-base');

/**
 * The `span_multi` query allows you to wrap a `multi term query` (one of wildcard,
 * fuzzy, prefix, range or regexp query) as a `span query`, so it can be nested.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-multi-term-query.html)
 *
 * @example
 * const spanQry = esb.spanMultiTermQuery()
 *     .match(esb.prefixQuery('user', 'ki').boost(1.08));
 *
 * @param {MultiTermQueryBase=} multiTermQry One of wildcard, fuzzy, prefix, range or regexp query
 *
 * @extends SpanQueryBase
 */
class SpanMultiTermQuery extends SpanQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(multiTermQry) {
        super('span_multi');

        if (!isNil(multiTermQry)) this.match(multiTermQry);
    }

    /**
     * Sets the multi term query.
     *
     * @param {MultiTermQueryBase} multiTermQry One of wildcard, fuzzy, prefix, range or regexp query
     * @returns {SpanMultiTermQuery} returns `this` so that calls can be chained.
     */
    match(multiTermQry) {
        checkType(multiTermQry, MultiTermQueryBase);

        this._queryOpts.match = multiTermQry;
        return this;
    }
}

module.exports = SpanMultiTermQuery;

},{"../../core":82,"../term-level-queries":161,"./span-query-base":148,"lodash.isnil":183}],145:[function(require,module,exports){
'use strict';

const {
    util: { checkType }
} = require('../../core');

const SpanQueryBase = require('./span-query-base');

/**
 * Matches spans which are near one another. One can specify `slop`, the maximum
 * number of intervening unmatched positions, as well as whether matches are
 * required to be in-order. The span near query maps to Lucene `SpanNearQuery`.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-near-query.html)
 *
 * @example
 * const spanQry = esb.spanNearQuery()
 *     .clauses([
 *         esb.spanTermQuery('field', 'value1'),
 *         esb.spanTermQuery('field', 'value2'),
 *         esb.spanTermQuery('field', 'value3')
 *     ])
 *     .slop(12)
 *     .inOrder(false);
 *
 * @extends SpanQueryBase
 */
class SpanNearQuery extends SpanQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('span_near');
    }

    /**
     * Sets the clauses element which is a list of one or more other span type queries.
     *
     * @param {Array<SpanQueryBase>} clauses
     * @returns {SpanNearQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If parameter `clauses` is not an instance of Array or if
     * any member of the array is not an instance of `SpanQueryBase`.
     */
    clauses(clauses) {
        checkType(clauses, Array);
        clauses.forEach(clause => checkType(clause, SpanQueryBase));

        this._queryOpts.clauses = clauses;
        return this;
    }

    /**
     * Configures the `slop`(default is 0), the maximum number of intervening
     * unmatched positions permitted.
     *
     * @param {number} slop A positive integer value, defaults is 0.
     * @returns {SpanNearQuery} returns `this` so that calls can be chained.
     */
    slop(slop) {
        this._queryOpts.slop = slop;
        return this;
    }

    // TODO: Add documentation for inOrder

    /**
     *
     * @param {boolean} enable
     * @returns {SpanNearQuery} returns `this` so that calls can be chained.
     */
    inOrder(enable) {
        this._queryOpts.in_order = enable;
        return this;
    }
}

module.exports = SpanNearQuery;

},{"../../core":82,"./span-query-base":148}],146:[function(require,module,exports){
'use strict';

const {
    util: { checkType }
} = require('../../core');

const SpanQueryBase = require('./span-query-base');

/**
 * Removes matches which overlap with another span query. The span not query
 * maps to Lucene `SpanNotQuery`.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-not-query.html)
 *
 * @example
 * const spanQry = esb.spanNotQuery()
 *     .include(esb.spanTermQuery('field1', 'hoya'))
 *     .exclude(esb.spanNearQuery()
 *         .clauses([
 *             esb.spanTermQuery('field1', 'la'),
 *             esb.spanTermQuery('field1', 'hoya')
 *         ])
 *         .slop(0)
 *         .inOrder(true));
 *
 * @extends SpanQueryBase
 */
class SpanNotQuery extends SpanQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('span_not');
    }

    /**
     * Sets the `include` clause which is the span query whose matches are filtered
     *
     * @param {SpanQueryBase} spanQry
     * @returns {SpanNotQuery} returns `this` so that calls can be chained.
     */
    include(spanQry) {
        checkType(spanQry, SpanQueryBase);

        this._queryOpts.include = spanQry;
        return this;
    }

    /**
     * Sets the `exclude` clause which is the span query whose matches must
     * not overlap those returned.
     *
     * @param {SpanQueryBase} spanQry
     * @returns {SpanNotQuery} returns `this` so that calls can be chained.
     */
    exclude(spanQry) {
        checkType(spanQry, SpanQueryBase);

        this._queryOpts.exclude = spanQry;
        return this;
    }

    /**
     * If set the amount of tokens before the include span can't have overlap with
     * the exclude span.
     *
     * @param {number} pre
     * @returns {SpanNotQuery} returns `this` so that calls can be chained.
     */
    pre(pre) {
        this._queryOpts.pre = pre;
        return this;
    }

    /**
     * If set the amount of tokens after the include span can't have overlap with the exclude span.
     *
     * @param {number} post
     * @returns {SpanNotQuery} returns `this` so that calls can be chained.
     */
    post(post) {
        this._queryOpts.post = post;
        return this;
    }

    /**
     * If set the amount of tokens from within the include span can't have overlap
     * with the exclude span. Equivalent of setting both `pre` and `post`.
     *
     * @param {number} dist
     * @returns {SpanNotQuery} returns `this` so that calls can be chained.
     */
    dist(dist) {
        this._queryOpts.dist = dist;
        return this;
    }
}

module.exports = SpanNotQuery;

},{"../../core":82,"./span-query-base":148}],147:[function(require,module,exports){
'use strict';

const {
    util: { checkType }
} = require('../../core');

const SpanQueryBase = require('./span-query-base');

/**
 * Matches the union of its span clauses. The span or query maps to Lucene `SpanOrQuery`.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-or-query.html)
 *
 * @example
 * const spanQry = esb.spanOrQuery()
 *     .clauses([
 *         esb.spanTermQuery('field', 'value1'),
 *         esb.spanTermQuery('field', 'value2'),
 *         esb.spanTermQuery('field', 'value3')
 *     ]);
 *
 * @extends SpanQueryBase
 */
class SpanOrQuery extends SpanQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('span_or');
    }

    /**
     * Sets the clauses element which is a list of one or more other span type queries.
     *
     * @param {Array<SpanQueryBase>} clauses
     * @returns {SpanOrQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If parameter `clauses` is not an instance of Array or if
     * any member of the array is not an instance of `SpanQueryBase`.
     */
    clauses(clauses) {
        checkType(clauses, Array);
        clauses.forEach(clause => checkType(clause, SpanQueryBase));

        this._queryOpts.clauses = clauses;
        return this;
    }
}

module.exports = SpanOrQuery;

},{"../../core":82,"./span-query-base":148}],148:[function(require,module,exports){
'use strict';

const { Query } = require('../../core');

/**
 * Interface-like class used to group and identify various implementations of Span queries.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @extends Query
 */
class SpanQueryBase extends Query {}

module.exports = SpanQueryBase;

},{"../../core":82}],149:[function(require,module,exports){
'use strict';

const has = require('lodash.has');
const isNil = require('lodash.isnil');

const SpanQueryBase = require('./span-query-base');

/**
 * Matches spans containing a term. The span term query maps to Lucene `SpanTermQuery`.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-term-query.html)
 *
 * @example
 * const qry = esb.spanTermQuery('user', 'kimchy');
 *
 * @example
 * const qry = esb.spanTermQuery()
 *     .field('user')
 *     .value('kimchy')
 *     .boost(2.0);
 *
 * @param {string=} field The document field to query against
 * @param {string|number=} value The query string
 *
 * @extends SpanQueryBase
 */
class SpanTermQuery extends SpanQueryBase {
    // This is extremely similar to ValueTermQueryBase
    // Maybe rename, move and reuse it?

    // eslint-disable-next-line require-jsdoc
    constructor(field, value) {
        super('span_term');

        if (!isNil(field)) this._field = field;
        if (!isNil(value)) this._queryOpts.value = value;
    }

    /**
     * Sets the field to search on.
     *
     * @param {string} field
     * @returns {SpanTermQuery} returns `this` so that calls can be chained.
     */
    field(field) {
        this._field = field;
        return this;
    }

    /**
     * Sets the query string.
     *
     * @param {string|number} queryVal
     * @returns {SpanTermQuery} returns `this` so that calls can be chained.
     */
    value(queryVal) {
        this._queryOpts.value = queryVal;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation of the Span term query
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        // recursiveToJSON doesn't seem to be required here.

        // Revisit this.. Smells a little bit
        if (!has(this._queryOpts, 'value')) {
            throw new Error('Value is required for Span term query!');
        }

        const qryOpts =
            Object.keys(this._queryOpts).length === 1
                ? this._queryOpts.value
                : this._queryOpts;
        return {
            [this.queryType]: {
                [this._field]: qryOpts
            }
        };
    }
}

module.exports = SpanTermQuery;

},{"./span-query-base":148,"lodash.has":179,"lodash.isnil":183}],150:[function(require,module,exports){
'use strict';

const SpanLittleBigQueryBase = require('./span-little-big-query-base');

/**
 * Returns matches which are enclosed inside another span query. The span within
 * query maps to Lucene `SpanWithinQuery`.
 *
 * Matching spans from `little` that are enclosed within `big` are returned.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-containing-query.html)
 *
 * @example
 * const spanQry = esb.spanWithinQuery()
 *     .little(esb.spanTermQuery('field1', 'foo'))
 *     .big(esb.spanNearQuery()
 *         .clauses([
 *             esb.spanTermQuery('field1', 'bar'),
 *             esb.spanTermQuery('field1', 'baz')
 *         ])
 *         .slop(5)
 *         .inOrder(true));
 *
 * @extends SpanLittleBigQueryBase
 */
class SpanWithinQuery extends SpanLittleBigQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('span_within');
    }
}

module.exports = SpanWithinQuery;

},{"./span-little-big-query-base":143}],151:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');
const { Query } = require('../../core');

/**
 * The `distance_feature` query can be used to filter documents that are inside
 * a timeframe or radius given an **origin** point. For dates the difference can be
 * minutes, hours, etc and for coordinates it can be meters, kilometers..
 *
 *  [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-distance-feature-query.html)
 *
 * NOTE: Only available in Elasticsearch 7.1.0+.
 *
 * @example
 * const query = new DistanceFeatureQuery('time');
 *   query
 *       .origin('now')
 *       .pivot('1h')
 *       .toJSON();
 * @param {string} field The field inside the document to be used in the query
 * @extends Query
 */
class DistanceFeatureQuery extends Query {
    /**
     * @param {string} field The field inside the document to be used in the query
     */
    constructor(field) {
        super('distance_feature');
        if (!isNil(field)) this._queryOpts.field = field;
    }

    /**
     * Sets the field for the `distance_feature` query
     * @param {string} fieldName Name of the field inside the document
     * @returns {DistanceFeatureQuery} Instance of the distance feature query
     */
    field(fieldName) {
        this._queryOpts.field = fieldName;
        return this;
    }

    /**
     * Sets the origin of the function. Date or point of coordinates
     * used to calculate distances
     * @param {GeoPoint | string} originPoint Array of coordinates, LatLng object, "now-1h"
     * @returns {DistanceFeatureQuery} Instance of the distance feature query
     */
    origin(originPoint) {
        this._queryOpts.origin = originPoint;
        return this;
    }

    /**
     * Distance from the origin at which relevance scores receive half of the boost value.
     * @param {string} pivotDistance Distance value. If the field value is date then this must be a
     * [time unit](https://www.elastic.co/guide/en/elasticsearch/reference/current/api-conventions.html#time-units).
     * If it's a geo point field, then a [distance unit](https://www.elastic.co/guide/en/elasticsearch/reference/current/api-conventions.html#distance-units)
     * @returns {DistanceFeatureQuery} Instance of the distance feature query
     */
    pivot(pivotDistance) {
        this._queryOpts.pivot = pivotDistance;
        return this;
    }
}

module.exports = DistanceFeatureQuery;

},{"../../core":82,"lodash.isnil":183}],152:[function(require,module,exports){
'use strict';

exports.MoreLikeThisQuery = require('./more-like-this-query');
exports.ScriptQuery = require('./script-query');
exports.ScriptScoreQuery = require('./script-score-query');
exports.PercolateQuery = require('./percolate-query');
exports.DistanceFeatureQuery = require('./distance-feature-query');
exports.RankFeatureQuery = require('./rank-feature-query');

},{"./distance-feature-query":151,"./more-like-this-query":153,"./percolate-query":154,"./rank-feature-query":155,"./script-query":156,"./script-score-query":157}],153:[function(require,module,exports){
'use strict';

const has = require('lodash.has');

const {
    Query,
    util: { checkType }
} = require('../../core');

/**
 * The More Like This Query (MLT Query) finds documents that are "like" a given set
 * of documents. In order to do so, MLT selects a set of representative terms of
 * these input documents, forms a query using these terms, executes the query and
 * returns the results. The user controls the input documents, how the terms should
 * be selected and how the query is formed.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html)
 *
 * @example
 * // Ask for documents that are similar to a provided piece of text
 * const qry = esb.moreLikeThisQuery()
 *     .fields(['title', 'description'])
 *     .like('Once upon a time')
 *     .minTermFreq(1)
 *     .maxQueryTerms(12);
 *
 * @example
 * // Mixing texts with documents already existing in the index
 * const qry = esb.moreLikeThisQuery()
 *     .fields(['title', 'description'])
 *     .like({ _index: 'imdb', _type: 'movies', _id: '1' })
 *     .like({ _index: 'imdb', _type: 'movies', _id: '2' })
 *     .like('and potentially some more text here as well')
 *     .minTermFreq(1)
 *     .maxQueryTerms(12);
 *
 * @example
 * // Provide documents not present in the index
 * const qry = esb.moreLikeThisQuery()
 *     .fields(['name.first', 'name.last'])
 *     .like([
 *         {
 *             _index: 'marvel',
 *             _type: 'quotes',
 *             doc: {
 *                 name: { first: 'Ben', last: 'Grimm' },
 *                 tweet: "You got no idea what I'd... what I'd give to be invisible."
 *             }
 *         },
 *         { _index: 'marvel', _type: 'quotes', _id: '2' }
 *     ])
 *     .minTermFreq(1)
 *     .maxQueryTerms(12);
 *
 * @extends Query
 */
class MoreLikeThisQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('more_like_this');
    }

    /**
     *
     * @private
     * @param {string} clauseType
     * @param {string|Object|Array} clauses
     */
    _setSearchClause(clauseType, clauses) {
        // Replace the field. Don't care about previous contents
        if (Array.isArray(clauses)) this._queryOpts[clauseType] = clauses;
        else if (!has(this._queryOpts, clauseType)) {
            // Keep the single `like` without array.
            this._queryOpts[clauseType] = clauses;
        } else {
            // Wrap the single `like` in an array
            if (!Array.isArray(this._queryOpts[clauseType])) {
                this._queryOpts[clauseType] = [this._queryOpts[clauseType]];
            }
            // Append to array
            this._queryOpts[clauseType].push(clauses);
        }
    }

    /**
     * Sets the list of fields to fetch and analyze the text from. Defaults to
     * the `_all` field for free text and to all possible fields for document inputs.
     *
     * @param {Array<string>} fields Array of fields to search against
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    fields(fields) {
        checkType(fields, Array);

        this._queryOpts.fields = fields;
        return this;
    }

    /**
     * Sets the search clause for the query. It is the only required parameter of the MLT query
     * and follows a versatile syntax, in which the user can specify free form text and/or
     * a single or multiple documents (see examples above). The syntax to specify documents
     * is similar to the one used by the [Multi GET API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-multi-get.html).
     * When specifying documents, the text is fetched from fields unless overridden
     * in each document request. The text is analyzed by the analyzer at the field,
     * but could also be overridden. The syntax to override the analyzer at the
     * field follows a similar syntax to the `per_field_analyzer` parameter of the
     * [Term Vectors API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-termvectors.html#docs-termvectors-per-field-analyzer).
     * Additionally, to provide documents not necessarily present in the index,
     * [artificial documents](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-termvectors.html#docs-termvectors-artificial-doc)
     * are also supported.
     *
     * If string or object is passed, it is
     * appended to the list. If an array is passed, it replaces the existing list.
     *
     * @param {string|Object|Array} like Can be passed as a string,
     * Object representing indexed document, or array of string/objects.
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    like(like) {
        this._setSearchClause('like', like);
        return this;
    }

    /**
     * The `unlike` parameter is used in conjunction with `like` in order not to
     * select terms found in a chosen set of documents. In other words, we could ask
     * for documents `like`: "Apple", but `unlike`: "cake crumble tree".
     * The syntax is the same as like.
     *
     * @param {string|Object|Array} unlike Can be passed as a string,
     * Object representing indexed document, or array of string/objects.
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    unlike(unlike) {
        this._setSearchClause('unlike', unlike);
        return this;
    }

    /**
     * Sets the text to find documents like it.
     *
     * Note: This parameter has been removed in elasticsearch 6.0. Use `like`
     * instead.
     *
     * @param {string} txt The text to find documents like it.
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    likeText(txt) {
        this._queryOpts.like_text = txt;
        return this;
    }

    /**
     * Sets the list of `ids` for the documents with syntax similar to
     * the [Multi GET API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-multi-get.html).
     *
     * Note: This parameter has been removed in elasticsearch 6.0. Use `like`
     * instead.
     *
     * @param {Array<string>} ids
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    ids(ids) {
        checkType(ids, Array);

        this._queryOpts.ids = ids;
        return this;
    }

    /**
     * Sets the list of `docs` for the documents with syntax similar to
     * the [Multi GET API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-multi-get.html).
     *
     * Note: This parameter has been removed in elasticsearch 6.0. Use `like`
     * instead.
     *
     * @param {Array<Object>} docs
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    docs(docs) {
        checkType(docs, Array);

        this._queryOpts.docs = docs;
        return this;
    }

    /**
     * Sets the maximum number of query terms that will be selected.
     * Increasing this value gives greater accuracy at the expense of query execution speed.
     * Defaults to `25`.
     *
     * @param {number} termsLimit The maximum number of query terms that will be selected.
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    maxQueryTerms(termsLimit) {
        this._queryOpts.max_query_terms = termsLimit;
        return this;
    }

    /**
     * Sets the minimum term frequency below which the terms will be ignored from
     * the input document Defaults to 2.
     *
     * @param {number} termFreqLimit
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    minTermFreq(termFreqLimit) {
        this._queryOpts.min_term_freq = termFreqLimit;
        return this;
    }

    /**
     * Sets the minimum document frequency below which the terms will be ignored
     * from the input document. Defaults to `5`.
     *
     * @param {number} docFreqLimit The minimum document frequency
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    minDocFreq(docFreqLimit) {
        this._queryOpts.min_doc_freq = docFreqLimit;
        return this;
    }

    /**
     * Sets the maximum document frequency above which the terms will be ignored
     * from the input document. Defaults to unbounded (`0`).
     *
     * @param {number} docFreqLimit The minimum document frequency
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    maxDocFreq(docFreqLimit) {
        this._queryOpts.max_doc_freq = docFreqLimit;
        return this;
    }

    /**
     * Sets the minimum word length below which the terms will be ignored.
     * Defaults to `0`.
     *
     * @param {number} wordLenLimit
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    minWordLength(wordLenLimit) {
        this._queryOpts.min_word_length = wordLenLimit;
        return this;
    }

    /**
     * Sets the maximum word length above which the terms will be ignored.
     * Defaults to unbounded (`0`).
     *
     * @param {number} wordLenLimit
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    maxWordLength(wordLenLimit) {
        this._queryOpts.max_word_length = wordLenLimit;
        return this;
    }

    /**
     * Sets the array of stop words. Any word in this set is considered
     * "uninteresting" and ignored.
     *
     * @param {Array<string>} words Array of stop words.
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained
     */
    stopWords(words) {
        this._queryOpts.stop_words = words;
        return this;
    }

    /**
     * Set the analyzer to control which analyzer will perform the analysis process on the text.
     * Defaults to the analyzer associated with the first field in `fields`.
     *
     * @param {string} analyzer A valid text analyzer.
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained.
     */
    analyzer(analyzer) {
        this._queryOpts.analyzer = analyzer;
        return this;
    }

    /**
     * Sets the value controlling how many `should` clauses in the boolean
     * query should match. It can be an absolute value (2), a percentage (30%)
     * or a combination of both. (Defaults to `"30%"`).
     *
     * @param {string|number} minimumShouldMatch An absolute value (`2`), a percentage (`30%`)
     * or a combination of both.
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained.
     */
    minimumShouldMatch(minimumShouldMatch) {
        this._queryOpts.minimum_should_match = minimumShouldMatch;
        return this;
    }

    /**
     * Sets the boost factor to use when boosting terms.
     * Defaults to deactivated (`0`).
     *
     * @param {number} boost A positive value to boost terms.
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained.
     */
    boostTerms(boost) {
        this._queryOpts.boost_terms = boost;
        return this;
    }

    /**
     * Specifies whether the input documents should also be included in the
     * search results returned. Defaults to `false`.
     *
     * @param {boolean} enable
     * @returns {MoreLikeThisQuery} returns `this` so that calls can be chained.
     */
    include(enable) {
        this._queryOpts.include = enable;
        return this;
    }
}

module.exports = MoreLikeThisQuery;

},{"../../core":82,"lodash.has":179}],154:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { checkType },
    Query
} = require('../../core');

/**
 * The `percolate` query can be used to match queries stored in an index.
 * The `percolate` query itself contains the document that will be used
 * as query to match with the stored queries.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-percolate-query.html)
 *
 * @example
 * const percolateQry = esb.percolateQuery('query', 'doctype')
 *     .document({ message: 'A new bonsai tree in the office' });
 *
 * const percolateQry = esb.percolateQuery()
 *     .field('query')
 *     .documentType('doctype')
 *     .index('my-index')
 *     .type('message')
 *     .id('1')
 *     .version(1);
 *
 * @param {string=} field The field of type `percolator` and that holds the indexed queries.
 * @param {string=} docType The type / mapping of the document being percolated.
 *
 * @extends Query
 */
class PercolateQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(field, docType) {
        super('percolate');
        this._queryOpts.documents = [];

        if (!isNil(field)) this._queryOpts.field = field;
        // Delegate this to method:
        if (!isNil(docType)) this._queryOpts.document_type = docType;
    }

    /**
     * Sets the field of type `percolator` and that holds the indexed queries.
     *
     * @param {string} field The field of type `percolator` and that holds the indexed queries.
     * @returns {PercolateQuery} returns `this` so that calls can be chained.
     */
    field(field) {
        this._queryOpts.field = field;
        return this;
    }

    /**
     * Sets the type / mapping of the document being percolated.
     *
     * Note: This param has been deprecated in elasticsearch 6.0. From 6.0 and
     * later, it is no longer required to specify the `document_type` parameter.
     *
     * @param {string} docType The type / mapping of the document being percolated.
     * @returns {PercolateQuery} returns `this` so that calls can be chained.
     */
    documentType(docType) {
        this._queryOpts.document_type = docType;
        return this;
    }

    /**
     * Appends given source document to the list of source documents being percolated.
     * Instead of specifying the source document being percolated,
     * the source can also be retrieved from an already stored document.
     *
     * @example
     *const qry = esb.percolateQuery('query', 'people')
     * .document({ name: 'Will Smith' });
     *
     * @param {Object} doc The source document being percolated.
     * @returns {PercolateQuery} returns `this` so that calls can be chained.
     */
    document(doc) {
        this._queryOpts.documents.push(doc);
        return this;
    }

    /**
     * Appends given source documents to the list of source documents being percolated.
     * Instead of specifying the source documents being percolated,
     * the source can also be retrieved from already stored documents.
     *
     * @example
     *const qry = esb.percolateQuery('query', 'people')
     * .documents([{ name: 'Will Smith' }, { name: 'Willow Smith' }]);
     *
     * @param {Object[]} docs The source documents being percolated.
     * @returns {PercolateQuery} returns `this` so that calls can be chained.
     */
    documents(docs) {
        checkType(docs, Array);

        this._queryOpts.documents = this._queryOpts.documents.concat(docs);
        return this;
    }

    /**
     * Sets the index the document resides in. This is a required parameter if `document`
     * is not specified.
     *
     * @param {string} index The index the document resides in.
     * @returns {PercolateQuery} returns `this` so that calls can be chained.
     */
    index(index) {
        this._queryOpts.index = index;
        return this;
    }

    /**
     * Sets the type of the document to fetch. This is a required parameter if `document`
     * is not specified.
     *
     * @param {string} type The type of the document to fetch.
     * @returns {PercolateQuery} returns `this` so that calls can be chained.
     */
    type(type) {
        this._queryOpts.type = type;
        return this;
    }

    /**
     * Sets the id of the document to fetch. This is a required parameter if `document`
     * is not specified.
     *
     * @param {string} id The id of the document to fetch.
     * @returns {PercolateQuery} returns `this` so that calls can be chained.
     */
    id(id) {
        this._queryOpts.id = id;
        return this;
    }

    /**
     * Sets the routing to be used to fetch document to percolate. Optional.
     *
     * @param {string} routing The routing to be used to fetch document to percolate.
     * @returns {PercolateQuery} returns `this` so that calls can be chained.
     */
    routing(routing) {
        this._queryOpts.routing = routing;
        return this;
    }

    /**
     * Sets the preference to be used to fetch document to percolate. Optional.
     *
     * @param {string} preference The preference to be used to fetch document to percolate.
     * @returns {PercolateQuery} returns `this` so that calls can be chained.
     */
    preference(preference) {
        this._queryOpts.preference = preference;
        return this;
    }

    /**
     * Sets the expected version of the document to be fetched. Optional.
     * If the version does not match, the search request will fail
     * with a version conflict error.
     *
     * @param {string} version The expected version of the document to be fetched.
     * @returns {PercolateQuery} returns `this` so that calls can be chained.
     */
    version(version) {
        this._queryOpts.version = version;
        return this;
    }
}

module.exports = PercolateQuery;

},{"../../core":82,"lodash.isnil":183}],155:[function(require,module,exports){
'use strict';

const { Query } = require('../../core');
const isNil = require('lodash.isnil');

/**
 * The rank_feature query boosts the relevance score on the numeric value of
 * document with a rank_feature/rank_features field.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-rank-feature-query.html)
 *
 * NOTE: This query was added in elasticsearch v7.0.
 *
 * @example
 * const query = new RankFeatureQuery('rank_feature_field');
 *   query
 *       .linear()
 *       .toJSON();
 * @param {string} field The field inside the document to be used in the query
 * @extends Query
 */
class RankFeatureQuery extends Query {
    /**
     * @param {string} field The field inside the document to be used in the query
     */
    constructor(field) {
        super('rank_feature');
        if (!isNil(field)) this._queryOpts.field = field;
    }

    /**
     * Sets the field for the `rank_feature` query
     * @param {string} fieldName Name of the field inside the document
     * @returns {RankFeatureQuery} Instance of the distance feature query
     */
    field(fieldName) {
        this._queryOpts.field = fieldName;
        return this;
    }

    /**
     * Linear function to boost relevance scores based on the value of the rank feature field
     * @returns {RankFeatureQuery}
     */
    linear() {
        this._queryOpts.linear = {};
        return this;
    }

    /**
     * Saturation function to boost relevance scores based on the value of the rank feature field.
     * Uses a default pivot value computed by Elasticsearch.
     * @returns {RankFeatureQuery}
     */
    saturation() {
        this._queryOpts.saturation = {};
        return this;
    }

    /**
     * Saturation function to boost relevance scores based on the value of the rank feature field.
     * @param {number} pivot
     * @returns {RankFeatureQuery}
     */
    saturationPivot(pivot) {
        this._queryOpts.saturation = {};
        this._queryOpts.saturation.pivot = pivot;
        return this;
    }

    /**
     * The log function gives a score equal to log(scaling_factor + S), where S
     * is the value of the rank feature field and scaling_factor is a configurable
     * scaling factor.
     * @param {number} scaling_factor
     * @returns {RankFeatureQuery}
     */
    log(scalingFactor) {
        this._queryOpts.log = {};
        this._queryOpts.log.scaling_factor = scalingFactor;
        return this;
    }

    /**
     * The sigmoid function extends the saturation function with a configurable exponent.
     * @param {number} pivot
     * @param {number} exponent
     * @returns {RankFeatureQuery}
     */
    sigmoid(pivot, exponent) {
        this._queryOpts.sigmoid = {};
        this._queryOpts.sigmoid.pivot = pivot;
        this._queryOpts.sigmoid.exponent = exponent;
        return this;
    }
}

module.exports = RankFeatureQuery;

},{"../../core":82,"lodash.isnil":183}],156:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Query,
    Script,
    util: { checkType }
} = require('../../core');

/**
 * A query allowing to define scripts as queries.
 * They are typically used in a filter context.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-script-query.html)
 *
 * @example
 * const scriptQry = esb.scriptQuery(esb.script()
 *  .lang('painless')
 *  .inline("doc['num1'].value > 1"))
 *
 * // Use in filter context
 * const qry = esb.boolQuery().must(scriptQry);
 *
 * @param {Script=} script
 *
 * @extends Query
 */
class ScriptQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(script) {
        super('script');

        if (!isNil(script)) this.script(script);
    }

    /**
     * Sets the `script` for query.
     *
     * @param {Script} script
     * @returns {ScriptQuery} returns `this` so that calls can be chained.
     */
    script(script) {
        checkType(script, Script);

        this._queryOpts.script = script;
        return this;
    }
}

module.exports = ScriptQuery;

},{"../../core":82,"lodash.isnil":183}],157:[function(require,module,exports){
'use strict';

const {
    Query,
    Script,
    util: { checkType }
} = require('../../core');

/**
 * A query that uses a script to provide a custom score for returned documents.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-script-score-query.html)
 *
 * NOTE: This query was added in elasticsearch v7.0.
 *
 * @example
 * const qry = esb.scriptScoreQuery()
 *   .query(esb.matchQuery("message", "elasticsearch"))
 *   .script(esb.script().source("doc['my-int'].value / 10"))
 *
 * @extends Query
 */
class ScriptScoreQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        super('script_score');
    }

    /**
     * Sets the query used to return documents.
     *
     * @param {Query} query A valid `Query` object
     * @returns {ScriptScoreQuery} returns `this` so that calls can be chained.
     */
    query(query) {
        checkType(query, Query);

        this._queryOpts.query = query;
        return this;
    }

    /**
     * Sets the script used to compute the score of documents returned by the query.
     *
     * @param {Script} script A valid `Script` object
     * @returns {ScriptScoreQuery} returns `this` so that calls can be chained.
     */
    script(script) {
        checkType(script, Script);

        this._queryOpts.script = script;
        return this;
    }

    /**
     * Sets the minimum score limit for documents to be included in search result.
     *
     * @param {number} limit Minimum score threshold
     * @returns {ScriptScoreQuery} returns `this` so that calls can be chained.
     */
    minScore(limit) {
        this._queryOpts.min_score = limit;
        return this;
    }
}

module.exports = ScriptScoreQuery;

},{"../../core":82}],158:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const { Query } = require('../../core');

/**
 * Returns documents that have at least one non-`null` value in the original field
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html)
 *
 * @example
 * const qry = esb.existsQuery('user');
 *
 * @example
 * const qry = esb.boolQuery().mustNot(esb.existsQuery('user'));
 *
 * @param {string=} field
 *
 * @extends Query
 */
class ExistsQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(field) {
        super('exists');

        if (!isNil(field)) this._queryOpts.field = field;
    }

    /**
     * Sets the field to search on.
     *
     * @param {string} field
     * @returns {ExistsQuery} returns `this` so that calls can be chained.
     */
    field(field) {
        this._queryOpts.field = field;
        return this;
    }
}

module.exports = ExistsQuery;

},{"../../core":82,"lodash.isnil":183}],159:[function(require,module,exports){
'use strict';

const MultiTermQueryBase = require('./multi-term-query-base');

/**
 * The fuzzy query generates all possible matching terms that are within
 * the maximum edit distance specified in `fuzziness` and then checks
 * the term dictionary to find out which of those generated terms
 * actually exist in the index.
 *
 * The fuzzy query uses similarity based on Levenshtein edit distance.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html)
 *
 * @example
 * const qry = esb.fuzzyQuery('user', 'ki');
 *
 * @example
 * // More advanced settings
 * const qry = esb.fuzzyQuery('user', 'ki')
 *     .fuzziness(2)
 *     .prefixLength(0)
 *     .maxExpansions(100)
 *     .boost(1.0);
 *
 * @param {string=} field
 * @param {string|number=} value
 *
 * @extends MultiTermQueryBase
 */
class FuzzyQuery extends MultiTermQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field, value) {
        super('fuzzy', field, value);
    }

    /**
     * Sets the `fuzziness` parameter which is interpreted as a Levenshtein Edit Distance —
     * the number of one character changes that need to be made to one string to make it
     * the same as another string.
     *
     * @param {number|string} factor Can be specified either as a number, or the maximum
     * number of edits, or as `AUTO` which generates an edit distance based on the length
     * of the term.
     * @returns {FuzzyQuery} returns `this` so that calls can be chained.
     */
    fuzziness(factor) {
        this._queryOpts.fuzziness = factor;
        return this;
    }

    /**
     * The number of initial characters which will not be “fuzzified”.
     * This helps to reduce the number of terms which must be examined. Defaults to `0`.
     *
     * @param {number} len Characters to skip fuzzy for. Defaults to `0`.
     * @returns {FuzzyQuery} returns `this` so that calls can be chained.
     */
    prefixLength(len) {
        this._queryOpts.prefix_length = len;
        return this;
    }

    /**
     * The maximum number of terms that the fuzzy query will expand to. Defaults to `50`.
     *
     * @param {number} limit Limit for fuzzy query expansion. Defaults to `50`.
     * @returns {FuzzyQuery} returns `this` so that calls can be chained.
     */
    maxExpansions(limit) {
        this._queryOpts.max_expansions = limit;
        return this;
    }

    /**
     * Transpositions (`ab` → `ba`) are allowed by default but can be disabled
     * by setting `transpositions` to false.
     *
     * @param {boolean} enable
     * @returns {FuzzyQuery} returns `this` so that calls can be chained.
     */
    transpositions(enable) {
        this._queryOpts.transpositions = enable;
        return this;
    }
}

module.exports = FuzzyQuery;

},{"./multi-term-query-base":162}],160:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Query,
    util: { checkType }
} = require('../../core');

/**
 * Filters documents that only have the provided ids.
 * Note, this query uses the _uid field.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ids-query.html)
 *
 * @example
 * const qry = esb.idsQuery('my_type', ['1', '4', '100']);
 *
 * @param {Array|string=} type The elasticsearch doc type
 * @param {Array=} ids List of ids to fiter on.
 *
 * @extends Query
 */
class IdsQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(type, ids) {
        super('ids');

        if (!isNil(type)) this._queryOpts.type = type;
        if (!isNil(ids)) this.values(ids);
    }

    /**
     * Sets the elasticsearch doc type to query on.
     * The type is optional and can be omitted, and can also accept an array of values.
     * If no type is specified, all types defined in the index mapping are tried.
     *
     * @param {Array<string>|string} type The elasticsearch doc type
     * @returns {IdsQuery} returns `this` so that calls can be chained.
     */
    type(type) {
        this._queryOpts.type = type;
        return this;
    }

    /**
     * Sets the list of ids to fiter on.
     *
     * @param {Array<string|number>} ids
     * @returns {IdsQuery} returns `this` so that calls can be chained.
     */
    values(ids) {
        checkType(ids, Array);

        this._queryOpts.values = ids;
        return this;
    }

    /**
     * Sets the list of ids to fiter on.
     * Alias for `values` method.
     *
     * @param {Array<string|number>} ids
     * @returns {IdsQuery} returns `this` so that calls can be chained.
     */
    ids(ids) {
        return this.values(ids);
    }
}

module.exports = IdsQuery;

},{"../../core":82,"lodash.isnil":183}],161:[function(require,module,exports){
'use strict';

exports.MultiTermQueryBase = require('./multi-term-query-base');

exports.TermQuery = require('./term-query');
exports.TermsQuery = require('./terms-query');
exports.TermsSetQuery = require('./terms-set-query');
exports.RangeQuery = require('./range-query');
exports.ExistsQuery = require('./exists-query');
exports.PrefixQuery = require('./prefix-query');
exports.WildcardQuery = require('./wildcard-query');
exports.RegexpQuery = require('./regexp-query');
exports.FuzzyQuery = require('./fuzzy-query');
exports.TypeQuery = require('./type-query');
exports.IdsQuery = require('./ids-query');

},{"./exists-query":158,"./fuzzy-query":159,"./ids-query":160,"./multi-term-query-base":162,"./prefix-query":163,"./range-query":164,"./regexp-query":165,"./term-query":166,"./terms-query":167,"./terms-set-query":168,"./type-query":169,"./wildcard-query":171}],162:[function(require,module,exports){
'use strict';

const ValueTermQueryBase = require('./value-term-query-base');

/**
 * Interface-like class used to group and identify various implementations of
 * multi term queries:
 *
 * - Wildcard Query
 * - Fuzzy Query
 * - Prefix Query
 * - Range Query
 * - Regexp Query
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @extends ValueTermQueryBase
 */
class MultiTermQueryBase extends ValueTermQueryBase {}

module.exports = MultiTermQueryBase;

},{"./value-term-query-base":170}],163:[function(require,module,exports){
'use strict';

const MultiTermQueryBase = require('./multi-term-query-base');
const { validateRewiteMethod } = require('../helper');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-prefix-query.html';

/**
 * Matches documents that have fields containing terms with a specified prefix (**not analyzed**).
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-prefix-query.html)
 *
 * @example
 * const qry = esb.prefixQuery('user', 'ki').boost(2.0);
 *
 * @param {string=} field
 * @param {string|number=} value
 *
 * @extends MultiTermQueryBase
 */
class PrefixQuery extends MultiTermQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field, value) {
        super('prefix', field, value);
    }

    /**
     * Sets the rewrite method. Valid values are:
     * - `constant_score` - tries to pick the best constant-score rewrite
     *  method based on term and document counts from the query.
     *  Synonyms - `constant_score_auto`, `constant_score_filter`
     *
     * - `scoring_boolean` - translates each term into boolean should and
     *  keeps the scores as computed by the query
     *
     * - `constant_score_boolean` - same as `scoring_boolean`, expect no scores
     *  are computed.
     *
     * - `constant_score_filter` - first creates a private Filter, by visiting
     *  each term in sequence and marking all docs for that term
     *
     * - `top_terms_boost_N` - first translates each term into boolean should
     *  and scores are only computed as the boost using the top N
     *  scoring terms. Replace N with an integer value.
     *
     * - `top_terms_N` - first translates each term into boolean should
     *  and keeps the scores as computed by the query. Only the top N
     *  scoring terms are used. Replace N with an integer value.
     *
     * Default is `constant_score`.
     *
     * This is an advanced option, use with care.
     *
     * Note: The deprecated multi term rewrite parameters `constant_score_auto`,
     * `constant_score_filter` (synonyms for `constant_score`) have been removed
     * in elasticsearch 6.0.
     *
     * @param {string} method The rewrite method as a string.
     * @returns {PrefixQuery} returns `this` so that calls can be chained.
     * @throws {Error} If the given `rewrite` method is not valid.
     */
    rewrite(method) {
        validateRewiteMethod(method, 'rewrite', ES_REF_URL);

        this._queryOpts.rewrite = method;
        return this;
    }
}

module.exports = PrefixQuery;

},{"../helper":129,"./multi-term-query-base":162}],164:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { invalidParam },
    consts: { GEO_RELATION_SET }
} = require('../../core');

const MultiTermQueryBase = require('./multi-term-query-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html';

const invalidRelationParam = invalidParam(
    ES_REF_URL,
    'relation',
    GEO_RELATION_SET
);

/**
 * Matches documents with fields that have terms within a certain range.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)
 *
 * @param {string=} field
 *
 * @example
 * const qry = esb.rangeQuery('age')
 *     .gte(10)
 *     .lte(20)
 *     .boost(2.0);
 *
 * @example
 * const qry = esb.rangeQuery('date').gte('now-1d/d').lt('now/d');
 *
 * @extends MultiTermQueryBase
 */
class RangeQuery extends MultiTermQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field) {
        super('range', field);
    }

    /**
     * @override
     * @throws {Error} This method cannot be called on RangeQuery
     */
    value() {
        console.log(`Please refer ${ES_REF_URL}`);
        throw new Error('value is not supported in RangeQuery');
    }

    /**
     * Greater-than or equal to
     *
     * @param {string|number} val
     * @returns {RangeQuery} returns `this` so that calls can be chained.
     */
    gte(val) {
        this._queryOpts.gte = val;
        return this;
    }

    /**
     * Less-than or equal to
     *
     * @param {string|number} val
     * @returns {RangeQuery} returns `this` so that calls can be chained.
     */
    lte(val) {
        this._queryOpts.lte = val;
        return this;
    }

    /**
     * Greater-than
     *
     * @param {string|number} val
     * @returns {RangeQuery} returns `this` so that calls can be chained.
     */
    gt(val) {
        this._queryOpts.gt = val;
        return this;
    }

    /**
     * Less-than
     *
     * @param {string|number} val
     * @returns {RangeQuery} returns `this` so that calls can be chained.
     */
    lt(val) {
        this._queryOpts.lt = val;
        return this;
    }

    /**
     * The lower bound. Defaults to start from the first.
     *
     * @param {string|number} val The lower bound value, type depends on field type
     * @returns {RangeQuery} returns `this` so that calls can be chained.
     */
    from(val) {
        this._queryOpts.from = val;
        return this;
    }

    /**
     * The upper bound. Defaults to unbounded.
     *
     * @param {string|number} val The upper bound value, type depends on field type
     * @returns {RangeQuery} returns `this` so that calls can be chained.
     */
    to(val) {
        this._queryOpts.to = val;
        return this;
    }

    /**
     * Should the first from (if set) be inclusive or not. Defaults to `true`
     *
     * @param {boolean} enable `true` to include, `false` to exclude
     * @returns {RangeQuery} returns `this` so that calls can be chained.
     */
    includeLower(enable) {
        this._queryOpts.include_lower = enable;
        return this;
    }

    /**
     * Should the last to (if set) be inclusive or not. Defaults to `true`.
     *
     * @param {boolean} enable `true` to include, `false` to exclude
     * @returns {RangeQuery} returns `this` so that calls can be chained.
     */
    includeUpper(enable) {
        this._queryOpts.include_upper = enable;
        return this;
    }

    /**
     * Time Zone to be applied to any range query related to dates.
     *
     * @param {string} zone
     * @returns {RangeQuery} returns `this` so that calls can be chained.
     */
    timeZone(zone) {
        this._queryOpts.time_zone = zone;
        return this;
    }

    /**
     * Sets the format expression for parsing the upper and lower bounds.
     * If no format is specified, then it will use the first format specified in the field mapping.
     *
     * @example
     * const qry = esb.rangeQuery('born')
     *     .gte('01/01/2012')
     *     .lte('2013')
     *     .format('dd/MM/yyyy||yyyy');
     *
     * @param {string} fmt Format for parsing upper and lower bounds.
     * @returns {RangeQuery} returns `this` so that calls can be chained
     */
    format(fmt) {
        this._queryOpts.format = fmt;
        return this;
    }

    /**
     * Sets the relationship between Query and indexed data
     * that will be used to determine if a Document should be matched or not.
     *
     * @param {string} relation Can be one of `WITHIN`, `CONTAINS`, `DISJOINT`
     * or `INTERSECTS`(default)
     * @returns {RangeQuery} returns `this` so that calls can be chained
     */
    relation(relation) {
        if (isNil(relation)) invalidRelationParam(relation);

        const relationUpper = relation.toUpperCase();
        if (!GEO_RELATION_SET.has(relationUpper)) {
            invalidRelationParam(relation);
        }

        this._queryOpts.relation = relationUpper;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation of the `range` query
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        // recursiveToJSON doesn't seem to be required here.
        return {
            [this.queryType]: {
                [this._field]: this._queryOpts
            }
        };
    }
}

module.exports = RangeQuery;

},{"../../core":82,"./multi-term-query-base":162,"lodash.isnil":183}],165:[function(require,module,exports){
'use strict';

const MultiTermQueryBase = require('./multi-term-query-base');
const { validateRewiteMethod } = require('../helper');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html';

/**
 * Query for regular expression term queries. Elasticsearch will apply the regexp
 * to the terms produced by the tokenizer for that field, and not to the original
 * text of the field.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html)
 *
 * @example
 * const qry = esb.regexpQuery('name.first', 's.*y').boost(1.2);
 *
 * @param {string=} field
 * @param {string|number=} value
 *
 * @extends MultiTermQueryBase
 */
class RegexpQuery extends MultiTermQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field, value) {
        super('regexp', field, value);
    }

    /**
     * Set special flags. Possible flags are `ALL` (default),
     * `ANYSTRING`, `COMPLEMENT`, `EMPTY`, `INTERSECTION`, `INTERVAL`, or `NONE`.
     *
     * @example
     * const qry = esb.regexpQuery('name.first', 's.*y')
     *     .flags('INTERSECTION|COMPLEMENT|EMPTY');
     *
     * @param {string} flags `|` separated flags. Possible flags are `ALL` (default),
     * `ANYSTRING`, `COMPLEMENT`, `EMPTY`, `INTERSECTION`, `INTERVAL`, or `NONE`.
     * @returns {RegexpQuery} returns `this` so that calls can be chained.
     */
    flags(flags) {
        this._queryOpts.flags = flags;
        return this;
    }

    /**
     * Allow case insensitive matching or not (added in 7.10.0).
     * Defaults to false.
     *
     * @example
     * const qry = esb.regexpQuery('name.first', 's.*y')
     *     .caseInsensitive(true);
     *
     * @param {boolean} caseInsensitive
     * @returns {RegexpQuery} returns `this` so that calls can be chained.
     */
    caseInsensitive(caseInsensitive) {
        this._queryOpts.case_insensitive = caseInsensitive;
        return this;
    }

    /**
     * Limit on how many automaton states regexp queries are allowed to create.
     * This protects against too-difficult (e.g. exponentially hard) regexps.
     * Defaults to 10000.
     *
     * @example
     * const qry = esb.regexpQuery('name.first', 's.*y')
     *     .flags('INTERSECTION|COMPLEMENT|EMPTY')
     *     .maxDeterminizedStates(20000);
     *
     * @param {number} limit
     * @returns {RegexpQuery} returns `this` so that calls can be chained.
     */
    maxDeterminizedStates(limit) {
        this._queryOpts.max_determinized_states = limit;
        return this;
    }

    /**
     * Sets the rewrite method. Valid values are:
     * - `constant_score` - tries to pick the best constant-score rewrite
     *  method based on term and document counts from the query.
     *  Synonyms - `constant_score_auto`, `constant_score_filter`
     *
     * - `scoring_boolean` - translates each term into boolean should and
     *  keeps the scores as computed by the query
     *
     * - `constant_score_boolean` - same as `scoring_boolean`, expect no scores
     *  are computed.
     *
     * - `constant_score_filter` - first creates a private Filter, by visiting
     *  each term in sequence and marking all docs for that term
     *
     * - `top_terms_boost_N` - first translates each term into boolean should
     *  and scores are only computed as the boost using the top N
     *  scoring terms. Replace N with an integer value.
     *
     * - `top_terms_N` - first translates each term into boolean should
     *  and keeps the scores as computed by the query. Only the top N
     *  scoring terms are used. Replace N with an integer value.
     *
     * Default is `constant_score`.
     *
     * This is an advanced option, use with care.
     *
     * Note: The deprecated multi term rewrite parameters `constant_score_auto`,
     * `constant_score_filter` (synonyms for `constant_score`) have been removed
     * in elasticsearch 6.0.
     *
     * @param {string} method The rewrite method as a string.
     * @returns {RegexpQuery} returns `this` so that calls can be chained.
     * @throws {Error} If the given `rewrite` method is not valid.
     */
    rewrite(method) {
        validateRewiteMethod(method, 'rewrite', ES_REF_URL);

        this._queryOpts.rewrite = method;
        return this;
    }
}

module.exports = RegexpQuery;

},{"../helper":129,"./multi-term-query-base":162}],166:[function(require,module,exports){
'use strict';

const ValueTermQueryBase = require('./value-term-query-base');

/**
 * The `term` query finds documents that contain the *exact* term specified
 * in the inverted index.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html)
 *
 * @example
 * const termQry = esb.termQuery('user', 'Kimchy');
 *
 * @param {string=} field
 * @param {string|number|boolean=} queryVal
 *
 * @extends ValueTermQueryBase
 */
class TermQuery extends ValueTermQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field, queryVal) {
        super('term', field, queryVal);
    }
}

module.exports = TermQuery;

},{"./value-term-query-base":170}],167:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    util: { checkType }
} = require('../../core');

const { Query } = require('../../core');

/**
 * Filters documents that have fields that match any of the provided terms (**not analyzed**).
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html)
 *
 * @example
 * const qry = esb.constantScoreQuery(
 *     esb.termsQuery('user', ['kimchy', 'elasticsearch'])
 * );
 *
 * @example
 * const qry = esb.termsQuery('user')
 *     .index('users')
 *     .type('user')
 *     .id(2)
 *     .path('followers');
 *
 * @param {string=} field
 * @param {Array|string|number|boolean=} values
 *
 * @extends Query
 */
class TermsQuery extends Query {
    // TODO: The DSL is a mess. Think about cleaning up some.

    // eslint-disable-next-line require-jsdoc
    constructor(field, values) {
        super('terms');

        // Default assume user is not insane
        this._isTermsLookup = false;
        this._termsLookupOpts = {};
        this._values = [];

        if (!isNil(field)) this._field = field;
        if (!isNil(values)) {
            if (Array.isArray(values)) this.values(values);
            else this.value(values);
        }
    }

    /**
     * Private helper function to set a terms lookup option.
     *
     * @private
     * @param {string} key
     * @param {string|number|boolean} val
     */
    _setTermsLookupOpt(key, val) {
        this._isTermsLookup = true;
        this._termsLookupOpts[key] = val;
    }

    /**
     * Sets the field to search on.
     *
     * @param {string} field
     * @returns {TermsQuery} returns `this` so that calls can be chained.
     */
    field(field) {
        this._field = field;
        return this;
    }

    /**
     * Append given value to list of values to run Terms Query with.
     *
     * @param {string|number|boolean} value
     * @returns {TermsQuery} returns `this` so that calls can be chained
     */
    value(value) {
        this._values.push(value);
        return this;
    }

    /**
     * Specifies the values to run query for.
     *
     * @param {Array<string|number|boolean>} values Values to run query for.
     * @returns {TermsQuery} returns `this` so that calls can be chained
     * @throws {TypeError} If `values` is not an instance of Array
     */
    values(values) {
        checkType(values, Array);

        this._values = this._values.concat(values);
        return this;
    }

    /**
     * Convenience method for setting term lookup options.
     * Valid options are `index`, `type`, `id`, `path`and `routing`
     *
     * @param {Object} lookupOpts An object with any of the keys `index`,
     * `type`, `id`, `path` and `routing`.
     * @returns {TermsQuery} returns `this` so that calls can be chained
     */
    termsLookup(lookupOpts) {
        checkType(lookupOpts, Object);

        this._isTermsLookup = true;
        Object.assign(this._termsLookupOpts, lookupOpts);
        return this;
    }

    /**
     * The index to fetch the term values from. Defaults to the current index.
     *
     * Note: The `index` parameter in the terms filter, used to look up terms in
     * a dedicated index is mandatory in elasticsearch 6.0. Previously, the
     * index defaulted to the index the query was executed on. In 6.0, this
     * index must be explicitly set in the request.
     *
     * @param {string} idx The index to fetch the term values from.
     * Defaults to the current index.
     * @returns {TermsQuery} returns `this` so that calls can be chained
     */
    index(idx) {
        this._setTermsLookupOpt('index', idx);
        return this;
    }

    /**
     * The type to fetch the term values from.
     *
     * @param {string} type
     * @returns {TermsQuery} returns `this` so that calls can be chained
     */
    type(type) {
        this._setTermsLookupOpt('type', type);
        return this;
    }

    /**
     * The id of the document to fetch the term values from.
     *
     * @param {string} id
     * @returns {TermsQuery} returns `this` so that calls can be chained
     */
    id(id) {
        this._setTermsLookupOpt('id', id);
        return this;
    }

    /**
     * The field specified as path to fetch the actual values for the `terms` filter.
     *
     * @param {string} path
     * @returns {TermsQuery} returns `this` so that calls can be chained
     */
    path(path) {
        this._setTermsLookupOpt('path', path);
        return this;
    }

    /**
     * A custom routing value to be used when retrieving the external terms doc.
     *
     * @param {string} routing
     * @returns {TermsQuery} returns `this` so that calls can be chained
     */
    routing(routing) {
        this._setTermsLookupOpt('routing', routing);
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation of the `terms` query
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        // recursiveToJSON doesn't seem to be required here.
        return {
            [this.queryType]: Object.assign({}, this._queryOpts, {
                [this._field]: this._isTermsLookup
                    ? this._termsLookupOpts
                    : this._values
            })
        };
    }
}

module.exports = TermsQuery;

},{"../../core":82,"lodash.isnil":183}],168:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    Query,
    util: { checkType }
} = require('../../core');

/**
 * Returns any documents that match with at least one or more of the provided
 * terms. The terms are not analyzed and thus must match exactly. The number of
 * terms that must match varies per document and is either controlled by a
 * minimum should match field or computed per document in a minimum should match
 * script.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-set-query.html)
 *
 * NOTE: This query was added in elasticsearch v6.1.
 *
 * @example
 * const qry = esb.termsSetQuery('codes', ['abc', 'def', 'ghi'])
 *     .minimumShouldMatchField('required_matches')
 *
 * @param {string=} field
 * @param {Array<string|number|boolean>|string|number=} terms
 *
 * @extends Query
 */
class TermsSetQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(field, terms) {
        super('terms_set');

        this._queryOpts.terms = [];

        if (!isNil(field)) this._field = field;
        if (!isNil(terms)) {
            if (Array.isArray(terms)) this.terms(terms);
            else this.term(terms);
        }
    }

    /**
     * Sets the field to search on.
     *
     * @param {string} field
     * @returns {TermsSetQuery} returns `this` so that calls can be chained.
     */
    field(field) {
        this._field = field;
        return this;
    }

    /**
     * Append given term to set of terms to run Terms Set Query with.
     *
     * @param {string|number|boolean} term
     * @returns {TermsSetQuery} returns `this` so that calls can be chained
     */
    term(term) {
        this._queryOpts.terms.push(term);
        return this;
    }

    /**
     * Specifies the terms to run query for.
     *
     * @param {Array<string|number|boolean>} terms Terms set to run query for.
     * @returns {TermsSetQuery} returns `this` so that calls can be chained
     * @throws {TypeError} If `terms` is not an instance of Array
     */
    terms(terms) {
        checkType(terms, Array);

        this._queryOpts.terms = this._queryOpts.terms.concat(terms);
        return this;
    }

    /**
     * Controls the number of terms that must match per document.
     *
     * @param {string} fieldName
     * @returns {TermsSetQuery} returns `this` so that calls can be chained
     */
    minimumShouldMatchField(fieldName) {
        this._queryOpts.minimum_should_match_field = fieldName;
        return this;
    }

    /**
     * Sets the `script` for query. It controls how many terms are required to
     * match in a more dynamic way.
     *
     * The `params.num_terms` parameter is available in the script to indicate
     * the number of terms that have been specified.
     *
     * @example
     * const qry = esb.termsSetQuery('codes', ['abc', 'def', 'ghi'])
     *     .minimumShouldMatchScript({
     *         source: "Math.min(params.num_terms, doc['required_matches'].value)"
     *     })
     *
     * @param {Script|string|Object} script
     * @returns {ScriptQuery} returns `this` so that calls can be chained.
     */
    minimumShouldMatchScript(script) {
        this._queryOpts.minimum_should_match_script = script;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation of the term level query
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        return {
            [this.queryType]: { [this._field]: this._queryOpts }
        };
    }
}

module.exports = TermsSetQuery;

},{"../../core":82,"lodash.isnil":183}],169:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const { Query } = require('../../core');

/**
 * Filters documents matching the provided document / mapping type.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-type-query.html)
 *
 * @example
 * const qry = esb.typeQuery('my_type');
 *
 * @param {string=} type The elasticsearch doc type
 *
 * @extends Query
 */
class TypeQuery extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(type) {
        super('type');

        if (!isNil(type)) this._queryOpts.value = type;
    }

    /**
     * Sets the elasticsearch doc type to query on.
     *
     * @param {string} type The elasticsearch doc type
     * @returns {TypeQuery} returns `this` so that calls can be chained.
     */
    value(type) {
        this._queryOpts.value = type;
        return this;
    }

    /**
     * Sets the elasticsearch doc type to query on.
     * Alias for method `value`.
     *
     * @param {string} type The elasticsearch doc type
     * @returns {TypeQuery} returns `this` so that calls can be chained.
     */
    type(type) {
        return this.value(type);
    }
}

module.exports = TypeQuery;

},{"../../core":82,"lodash.isnil":183}],170:[function(require,module,exports){
'use strict';

const has = require('lodash.has');
const isNil = require('lodash.isnil');

const { Query } = require('../../core');

/**
 * The `ValueTermQueryBase` provides support for common options used across
 * various term level query implementations.
 *
 * @param {string} queryType
 * @param {string=} field The document field to query against
 * @param {string=} value The query string
 *
 * @extends Query
 */
class ValueTermQueryBase extends Query {
    // eslint-disable-next-line require-jsdoc
    constructor(queryType, field, value) {
        super(queryType);

        if (!isNil(field)) this._field = field;
        if (!isNil(value)) this._queryOpts.value = value;
    }

    /**
     * Sets the field to search on.
     *
     * @param {string} field
     * @returns {ValueTermQueryBase} returns `this` so that calls can be chained.
     */
    field(field) {
        this._field = field;
        return this;
    }

    /**
     * Sets the query string.
     *
     * @param {string|number|boolean} queryVal
     * @returns {ValueTermQueryBase} returns `this` so that calls can be chained.
     */
    value(queryVal) {
        this._queryOpts.value = queryVal;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation of the term level query
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        // recursiveToJSON doesn't seem to be required here.

        // Revisit this.. Smells a little bit
        if (!has(this._queryOpts, 'value')) {
            throw new Error('Value is required for term level query!');
        }

        const qryOpts =
            Object.keys(this._queryOpts).length === 1
                ? this._queryOpts.value
                : this._queryOpts;
        return {
            [this.queryType]: {
                [this._field]: qryOpts
            }
        };
    }

    /**
     * Allows ASCII case insensitive matching of the value with the indexed
     * field values when set to true.
     *
     * NOTE: Only available in Elasticsearch v7.10.0+
     *
     * @param {boolean} value
     * @returns {ValueTermQueryBase} returns `this` so that calls can be chained.
     */
    caseInsensitive(value = true) {
        this._queryOpts.case_insensitive = value;
        return this;
    }
}

module.exports = ValueTermQueryBase;

},{"../../core":82,"lodash.has":179,"lodash.isnil":183}],171:[function(require,module,exports){
'use strict';

const MultiTermQueryBase = require('./multi-term-query-base');
const { validateRewiteMethod } = require('../helper');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html';

/**
 * Matches documents that have fields matching a wildcard expression (**not analyzed**).
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html)
 *
 * @example
 * const qry = esb.wildcardQuery('user', 'ki*y').boost(2.0);
 *
 * @param {string=} field
 * @param {string=} value
 *
 * @extends MultiTermQueryBase
 */
class WildcardQuery extends MultiTermQueryBase {
    // eslint-disable-next-line require-jsdoc
    constructor(field, value) {
        super('wildcard', field, value);
    }

    /**
     * Allow case insensitive matching or not (added in 7.10.0).
     * Defaults to false.
     *
     * @example
     * const qry = esb.wildcardQuery('user', 'ki*y')
     *     .caseInsensitive(true);
     *
     * @param {boolean} caseInsensitive
     * @returns {RegexpQuery} returns `this` so that calls can be chained.
     */
    caseInsensitive(caseInsensitive) {
        this._queryOpts.case_insensitive = caseInsensitive;
        return this;
    }

    /**
     * Sets the rewrite method. Valid values are:
     * - `constant_score` - tries to pick the best constant-score rewrite
     *  method based on term and document counts from the query.
     *  Synonyms - `constant_score_auto`, `constant_score_filter`
     *
     * - `scoring_boolean` - translates each term into boolean should and
     *  keeps the scores as computed by the query
     *
     * - `constant_score_boolean` - same as `scoring_boolean`, expect no scores
     *  are computed.
     *
     * - `constant_score_filter` - first creates a private Filter, by visiting
     *  each term in sequence and marking all docs for that term
     *
     * - `top_terms_boost_N` - first translates each term into boolean should
     *  and scores are only computed as the boost using the top N
     *  scoring terms. Replace N with an integer value.
     *
     * - `top_terms_N` - first translates each term into boolean should
     *  and keeps the scores as computed by the query. Only the top N
     *  scoring terms are used. Replace N with an integer value.
     *
     * Default is `constant_score`.
     *
     * This is an advanced option, use with care.
     *
     * Note: The deprecated multi term rewrite parameters `constant_score_auto`,
     * `constant_score_filter` (synonyms for `constant_score`) have been removed
     * in elasticsearch 6.0.
     *
     * @param {string} method The rewrite method as a string.
     * @returns {WildcardQuery} returns `this` so that calls can be chained.
     * @throws {Error} If the given `rewrite` method is not valid.
     */
    rewrite(method) {
        validateRewiteMethod(method, 'rewrite', ES_REF_URL);

        this._queryOpts.rewrite = method;
        return this;
    }
}

module.exports = WildcardQuery;

},{"../helper":129,"./multi-term-query-base":162}],172:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    MatchAllQuery,
    termLevelQueries: { ExistsQuery },
    compoundQueries: {
        BoolQuery,
        FunctionScoreQuery,
        scoreFunctions: { RandomScoreFunction }
    }
} = require('./queries');

const {
    Query,
    util: { checkType }
} = require('./core');

/**
 * Recipe for the now removed `missing` query.
 *
 * Can be accessed using `esb.recipes.missingQuery` OR `esb.cookMissingQuery`.
 *
 * [Elasticsearch refererence](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html#_literal_missing_literal_query)
 *
 * @example
 * const qry = esb.cookMissingQuery('user');
 *
 * qry.toJSON();
 * {
 *   "bool": {
 *     "must_not": {
 *       "exists": {
 *         "field": "user"
 *       }
 *     }
 *   }
 * }
 *
 * @param {string} field The field which should be missing the value.
 * @returns {BoolQuery} A boolean query with a `must_not` `exists` clause is returned.
 */
exports.missingQuery = function missingQuery(field) {
    return new BoolQuery().mustNot(new ExistsQuery(field));
};

/**
 * Recipe for random sort query. Takes a query and returns the same
 * wrapped in a random scoring query.
 *
 * Can be accessed using `esb.recipes.randomSortQuery` OR `esb.cookRandomSortQuery`.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-random)
 *
 * @example
 * const reqBody = esb.requestBodySearch()
 *     .query(esb.cookRandomSortQuery(esb.rangeQuery('age').gte(10)))
 *     .size(100);
 *
 * reqBody.toJSON();
 * {
 *   "query": {
 *     "function_score": {
 *       "query": {
 *         "range": { "age": { "gte": 10 } }
 *       },
 *       "random_score": {}
 *     }
 *   },
 *   "size": 100
 * }
 *
 * @param {Query=} query The query to fetch documents for. Defaults to `match_all` query.
 * @param {number=} seed A seed value for the random score function.
 * @returns {FunctionScoreQuery} A `function_score` query with random sort applied
 * @throws {TypeError} If `query` is not an instance of `Query`.
 */
exports.randomSortQuery = function randomSortQuery(
    query = new MatchAllQuery(),
    seed
) {
    checkType(query, Query);
    const func = new RandomScoreFunction();
    return new FunctionScoreQuery()
        .query(query)
        .function(isNil(seed) ? func : func.seed(seed));
};

/**
 * Recipe for constructing a filter query using `bool` query.
 * Optionally, scoring can be enabled.
 *
 * Can be accessed using `esb.recipes.filterQuery` OR `esb.cookFilterQuery`.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)
 *
 * @example
 * const boolQry = esb.cookFilterQuery(esb.termQuery('status', 'active'), true);
 * boolQry.toJSON();
 * {
 *   "bool": {
 *     "must": { "match_all": {} },
 *     "filter": {
 *       "term": { "status": "active" }
 *     }
 *   }
 * }
 *
 * @param {Query} query The query to fetch documents for.
 * @param {boolean=} scoring Optional flag for enabling/disabling scoring. Disabled by default.
 * If enabled, a score of `1.0` will be assigned to all documents.
 * @returns {BoolQuery} A `bool` query with a `filter` clause is returned.
 * @throws {TypeError} If `query` is not an instance of `Query`.
 */
exports.filterQuery = function filterQuery(query, scoring = false) {
    checkType(query, Query);

    const boolQry = new BoolQuery().filter(query);
    return scoring === true ? boolQry.must(new MatchAllQuery()) : boolQry;
};

},{"./core":82,"./queries":130,"lodash.isnil":183}],173:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const { Suggester } = require('../core');

/**
 * The `AnalyzedSuggesterBase` provides support for common options used
 * in `TermSuggester` and `PhraseSuggester`.
 *
 * **NOTE:** Instantiating this directly should not be required.
 * However, if you wish to add a custom implementation for whatever reason,
 * this class could be extended.
 *
 * @param {string} suggesterType The type of suggester.
 * Can be one of `term`, `phrase`
 * @param {string} name The name of the Suggester, an arbitrary identifier
 * @param {string=} field The field to fetch the candidate suggestions from.
 * @param {string=} txt A string to get suggestions for.
 *
 * @throws {Error} if `name` is empty
 * @throws {Error} if `suggesterType` is empty
 *
 * @extends Suggester
 */
class AnalyzedSuggesterBase extends Suggester {
    // eslint-disable-next-line require-jsdoc
    constructor(suggesterType, name, field, txt) {
        super(suggesterType, name, field);

        if (!isNil(txt)) this._opts.text = txt;
    }

    /**
     * Sets the text to get suggestions for. If not set, the global
     * suggestion text will be used.
     *
     * @param {string} txt A string to get suggestions for.
     * @returns {AnalyzedSuggesterBase} returns `this` so that calls can be chained.
     */
    text(txt) {
        this._opts.text = txt;
        return this;
    }

    /**
     * Sets the analyzer to analyse the suggest text with. Defaults to
     * the search analyzer of the suggest field.
     *
     * @param {string} analyzer The analyzer to analyse the suggest text with.
     * @returns {AnalyzedSuggesterBase} returns `this` so that calls can be chained.
     */
    analyzer(analyzer) {
        this._suggestOpts.analyzer = analyzer;
        return this;
    }

    /**
     * Sets the maximum number of suggestions to be retrieved from each individual shard.
     * During the reduce phase only the top N suggestions are returned based on the `size`
     * option. Defaults to the `size` option. Setting this to a value higher than the `size`
     * can be useful in order to get a more accurate document frequency for spelling
     * corrections at the cost of performance. Due to the fact that terms are partitioned
     * amongst shards, the shard level document frequencies of spelling corrections
     * may not be precise. Increasing this will make these document frequencies
     * more precise.
     *
     * @param {number} size
     * @returns {AnalyzedSuggesterBase} returns `this` so that calls can be chained.
     */
    shardSize(size) {
        this._suggestOpts.shard_size = size;
        return this;
    }
}

module.exports = AnalyzedSuggesterBase;

},{"../core":82,"lodash.isnil":183}],174:[function(require,module,exports){
'use strict';

const isObject = require('lodash.isobject');

const {
    Suggester,
    util: { setDefault }
} = require('../core');

/**
 * The completion suggester provides auto-complete/search-as-you-type
 * functionality. This is a navigational feature to guide users to relevant
 * results as they are typing, improving search precision. It is not meant
 * for spell correction or did-you-mean functionality like the term or
 * phrase suggesters.
 *
 * Ideally, auto-complete functionality should be as fast as a user types to
 * provide instant feedback relevant to what a user has already typed in.
 * Hence, completion suggester is optimized for speed. The suggester uses
 * data structures that enable fast lookups, but are costly to build
 * and are stored in-memory.
 *
 * Elasticsearch reference
 *   - [Completion Suggester](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-completion.html)
 *   - [Context Suggester](https://www.elastic.co/guide/en/elasticsearch/reference/current/suggester-context.html)
 *
 * @example
 * const suggest = esb.completionSuggester('song-suggest', 'suggest').prefix('nir');
 *
 * @example
 * const suggest = new esb.CompletionSuggester('place_suggestion', 'suggest')
 *     .prefix('tim')
 *     .size(10)
 *     .contexts('place_type', ['cafe', 'restaurants']);
 *
 * @param {string} name The name of the Suggester, an arbitrary identifier
 * @param {string=} field The field to fetch the candidate suggestions from.
 *
 * @throws {Error} if `name` is empty
 *
 * @extends Suggester
 */
class CompletionSuggester extends Suggester {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field) {
        super('completion', name, field);
    }

    /**
     * Sets the `prefix` for the `CompletionSuggester` query.
     *
     * @param {string} prefix
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    prefix(prefix) {
        this._opts.prefix = prefix;
        return this;
    }

    /**
     * Sets whether duplicate suggestions should be filtered out (defaults to false).
     *
     * NOTE: This option was added in elasticsearch v6.1.
     *
     * @param {boolean} skip Enable/disable skipping duplicates
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    skipDuplicates(skip = true) {
        this._suggestOpts.skip_duplicates = skip;
        return this;
    }

    /**
     * Check that the object property `this._suggestOpts.fuzzy` is an object.
     * Set empty object if required.
     *
     * @private
     */
    _checkFuzzy() {
        if (!isObject(this._suggestOpts.fuzzy)) {
            this._suggestOpts.fuzzy = {};
        }
    }

    /**
     * Sets the `fuzzy` parameter. Can be customised with specific fuzzy parameters.
     *
     * @param {boolean|Object=} fuzzy Enable/disable `fuzzy` using boolean or
     * object(with params)
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    fuzzy(fuzzy = true) {
        this._suggestOpts.fuzzy = fuzzy;
        return this;
    }

    /**
     * Sets the `fuzziness` parameter which is interpreted as a Levenshtein Edit Distance —
     * the number of one character changes that need to be made to one string to make it
     * the same as another string.
     *
     * @example
     * const suggest = esb.completionSuggester('song-suggest', 'suggest')
     *     .prefix('nor')
     *     .fuzziness(2);
     *
     * @param {number|string} factor Can be specified either as a number, or the maximum
     * number of edits, or as `AUTO` which generates an edit distance based on the length
     * of the term.
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    fuzziness(factor) {
        this._checkFuzzy();

        this._suggestOpts.fuzzy.fuzziness = factor;
        return this;
    }

    /**
     * Transpositions (`ab` → `ba`) are allowed by default but can be disabled
     * by setting `transpositions` to false.
     *
     * @param {boolean} enable
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    transpositions(enable) {
        this._checkFuzzy();

        this._suggestOpts.fuzzy.transpositions = enable;
        return this;
    }

    /**
     * Sets the minimum length of the input before fuzzy suggestions are returned,
     * defaults 3
     *
     * @param {number} len Minimum length of the input before fuzzy suggestions
     * are returned, defaults 3
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    minLength(len) {
        this._checkFuzzy();

        this._suggestOpts.fuzzy.min_length = len;
        return this;
    }

    /**
     * The number of initial characters which will not be "fuzzified".
     * This helps to reduce the number of terms which must be examined. Defaults to `1`.
     *
     * @param {number} len Characters to skip fuzzy for. Defaults to `1`.
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    prefixLength(len) {
        this._checkFuzzy();

        this._suggestOpts.fuzzy.prefix_length = len;
        return this;
    }

    /**
     * If `true`, all measurements (like fuzzy edit distance, transpositions,
     * and lengths) are measured in Unicode code points instead of in bytes.
     * This is slightly slower than raw bytes, so it is set to `false` by default.
     *
     * @param {boolean} enable Measure in Unicode code points instead of in bytes.
     * `false` by default.
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    unicodeAware(enable) {
        this._checkFuzzy();

        this._suggestOpts.fuzzy.unicode_aware = enable;
        return this;
    }

    /**
     * Sets the regular expression for completion suggester which supports regex queries.
     *
     * @example
     * const suggest = esb.completionSuggester('song-suggest', 'suggest')
     *     .regex('n[ever|i]r');
     *
     * @param {string} expr Regular expression
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    regex(expr) {
        this._opts.regex = expr;
        return this;
    }

    /**
     * Set special flags. Possible flags are `ALL` (default),
     * `ANYSTRING`, `COMPLEMENT`, `EMPTY`, `INTERSECTION`, `INTERVAL`, or `NONE`.
     *
     * @param {string} flags `|` separated flags. Possible flags are `ALL` (default),
     * `ANYSTRING`, `COMPLEMENT`, `EMPTY`, `INTERSECTION`, `INTERVAL`, or `NONE`.
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    flags(flags) {
        setDefault(this._suggestOpts, 'regex', {});

        this._suggestOpts.regex.flags = flags;
        return this;
    }

    /**
     * Limit on how many automaton states regexp queries are allowed to create.
     * This protects against too-difficult (e.g. exponentially hard) regexps.
     * Defaults to 10000. You can raise this limit to allow more complex regular
     * expressions to execute.
     *
     * @param {number} limit
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    maxDeterminizedStates(limit) {
        setDefault(this._suggestOpts, 'regex', {});

        this._suggestOpts.regex.max_determinized_states = limit;
        return this;
    }

    /**
     * The completion suggester considers all documents in the index, but it is often
     * desirable to serve suggestions filtered and/or boosted by some criteria.
     *
     * To achieve suggestion filtering and/or boosting, you can add context mappings
     * while configuring a completion field. You can define multiple context mappings
     * for a completion field. Every context mapping has a unique name and a type.
     *
     * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/suggester-context.html)
     *
     * @example
     * const suggest = new esb.CompletionSuggester('place_suggestion', 'suggest')
     *     .prefix('tim')
     *     .size(10)
     *     .contexts('place_type', [
     *         { context: 'cafe' },
     *         { context: 'restaurants', boost: 2 }
     *     ]);
     *
     * @example
     * // Suggestions can be filtered and boosted with respect to how close they
     * // are to one or more geo points. The following filters suggestions that
     * // fall within the area represented by the encoded geohash of a geo point:
     * const suggest = new esb.CompletionSuggester('place_suggestion', 'suggest')
     *     .prefix('tim')
     *     .size(10)
     *     .contexts('location', { lat: 43.662, lon: -79.38 });
     *
     * @example
     * // Suggestions that are within an area represented by a geohash can also be
     * // boosted higher than others
     * const suggest = new esb.CompletionSuggester('place_suggestion', 'suggest')
     *     .prefix('tim')
     *     .size(10)
     *     .contexts('location', [
     *         {
     *             lat: 43.6624803,
     *             lon: -79.3863353,
     *             precision: 2
     *         },
     *         {
     *             context: {
     *                 lat: 43.6624803,
     *                 lon: -79.3863353
     *             },
     *             boost: 2
     *         }
     *     ]);
     *
     * @param {string} name
     * @param {Array|Object} ctx
     * @returns {CompletionSuggester} returns `this` so that calls can be chained.
     */
    contexts(name, ctx) {
        // This whole feature is bizzare!
        // Not very happy with the implementation.
        setDefault(this._suggestOpts, 'contexts', {});

        this._suggestOpts.contexts[name] = ctx;
        return this;
    }
}

module.exports = CompletionSuggester;

},{"../core":82,"lodash.isobject":184}],175:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    consts: { SUGGEST_MODE_SET },
    util: { invalidParam }
} = require('../core');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-phrase.html#_direct_generators';

const invalidSuggestModeParam = invalidParam(
    ES_REF_URL,
    'suggest_mode',
    SUGGEST_MODE_SET
);

/**
 * The `phrase` suggester uses candidate generators to produce a list of possible
 * terms per term in the given text. A single candidate generator is similar
 * to a `term` suggester called for each individual term in the text. The output
 * of the generators is subsequently scored in combination with the candidates
 * from the other terms to for suggestion candidates.
 *
 * The Phrase suggest API accepts a list of generators under the key `direct_generator`
 * each of the generators in the list are called per term in the original text.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-phrase.html#_direct_generators)
 *
 * @param {string=} field The field to fetch the candidate suggestions from.
 */
class DirectGenerator {
    // eslint-disable-next-line require-jsdoc
    constructor(field) {
        this._body = {};

        if (!isNil(field)) this._body.field = field;
    }

    /**
     * Sets field to fetch the candidate suggestions from. This is a required option
     * that either needs to be set globally or per suggestion.
     *
     * @param {string} field a valid field name
     * @returns {DirectGenerator} returns `this` so that calls can be chained
     */
    field(field) {
        this._body.field = field;
        return this;
    }

    /**
     * Sets the number of suggestions to return (defaults to `5`).
     *
     * @param {number} size
     * @returns {DirectGenerator} returns `this` so that calls can be chained.
     */
    size(size) {
        this._body.size = size;
        return this;
    }

    /**
     * Sets the suggest mode which controls what suggestions are included
     * or controls for what suggest text terms, suggestions should be suggested.
     *  All values other than `always` can be thought of as an optimization to
     * generate fewer suggestions to test on each shard and are not rechecked
     * when combining the suggestions generated on each shard. Thus `missing`
     * will generate suggestions for terms on shards that do not contain them
     * even other shards do contain them. Those should be filtered out
     * using `confidence`.
     *
     * Three possible values can be specified:
     *   - `missing`: Only provide suggestions for suggest text terms that
     *     are not in the index. This is the default.
     *   - `popular`:  Only suggest suggestions that occur in more docs
     *     than the original suggest text term.
     *   - `always`: Suggest any matching suggestions based on terms in the suggest text.
     *
     * @param {string} mode Can be `missing`, `popular` or `always`
     * @returns {DirectGenerator} returns `this` so that calls can be chained.
     * @throws {Error} If `mode` is not one of `missing`, `popular` or `always`.
     */
    suggestMode(mode) {
        if (isNil(mode)) invalidSuggestModeParam(mode);

        const modeLower = mode.toLowerCase();
        if (!SUGGEST_MODE_SET.has(modeLower)) {
            invalidSuggestModeParam(mode);
        }

        this._body.suggest_mode = modeLower;
        return this;
    }

    /**
     * Sets the maximum edit distance candidate suggestions can have
     * in order to be considered as a suggestion. Can only be a value
     * between 1 and 2. Any other value result in an bad request
     * error being thrown. Defaults to 2.
     *
     * @param {number} maxEdits Value between 1 and 2. Defaults to 2.
     * @returns {DirectGenerator} returns `this` so that calls can be chained.
     */
    maxEdits(maxEdits) {
        this._body.max_edits = maxEdits;
        return this;
    }

    /**
     * Sets the number of minimal prefix characters that must match in order
     * to be a candidate suggestions. Defaults to 1.
     *
     * Increasing this number improves spellcheck performance.
     * Usually misspellings don't occur in the beginning of terms.
     *
     * @param {number} len The number of minimal prefix characters that must match in order
     * to be a candidate suggestions. Defaults to 1.
     * @returns {DirectGenerator} returns `this` so that calls can be chained.
     */
    prefixLength(len) {
        this._body.prefix_length = len;
        return this;
    }

    /**
     * Sets the minimum length a suggest text term must have in order to be included.
     * Defaults to 4.
     *
     * @param {number} len The minimum length a suggest text term must have in order
     * to be included. Defaults to 4.
     * @returns {DirectGenerator} returns `this` so that calls can be chained.
     */
    minWordLength(len) {
        this._body.min_word_length = len;
        return this;
    }

    /**
     * Sets factor that is used to multiply with the `shards_size` in order to inspect
     * more candidate spell corrections on the shard level.
     * Can improve accuracy at the cost of performance. Defaults to 5.
     *
     * @param {number} maxInspections Factor used to multiple with `shards_size` in
     * order to inspect more candidate spell corrections on the shard level.
     * Defaults to 5
     * @returns {DirectGenerator} returns `this` so that calls can be chained.
     */
    maxInspections(maxInspections) {
        this._body.max_inspections = maxInspections;
        return this;
    }

    /**
     * Sets the minimal threshold in number of documents a suggestion should appear in.
     * This can be specified as an absolute number or as a relative percentage of
     * number of documents. This can improve quality by only suggesting high
     * frequency terms. Defaults to 0f and is not enabled. If a value higher than 1
     * is specified then the number cannot be fractional. The shard level document
     * frequencies are used for this option.
     *
     * @param {number} limit Threshold in number of documents a suggestion
     * should appear in. Defaults to 0f and is not enabled.
     * @returns {DirectGenerator} returns `this` so that calls can be chained.
     */
    minDocFreq(limit) {
        this._body.min_doc_freq = limit;
        return this;
    }

    /**
     * Sets the maximum threshold in number of documents a suggest text token can
     * exist in order to be included. Can be a relative percentage number (e.g 0.4)
     * or an absolute number to represent document frequencies. If an value higher
     * than 1 is specified then fractional can not be specified. Defaults to 0.01f.
     * This can be used to exclude high frequency terms from being spellchecked.
     * High frequency terms are usually spelled correctly on top of this also
     * improves the spellcheck performance. The shard level document frequencies are
     * used for this option.
     *
     * @param {number} limit Maximum threshold in number of documents a suggest text
     * token can exist in order to be included. Defaults to 0.01f.
     * @returns {DirectGenerator} returns `this` so that calls can be chained.
     */
    maxTermFreq(limit) {
        this._body.max_term_freq = limit;
        return this;
    }

    /**
     * Sets the filter (analyzer) that is applied to each of the tokens passed to this
     * candidate generator. This filter is applied to the original token before
     * candidates are generated.
     *
     * @param {string} filter a filter (analyzer) that is applied to each of the
     * tokens passed to this candidate generator.
     * @returns {DirectGenerator} returns `this` so that calls can be chained.
     */
    preFilter(filter) {
        this._body.pre_filter = filter;
        return this;
    }

    /**
     * Sets the filter (analyzer) that is applied to each of the generated tokens
     * before they are passed to the actual phrase scorer.
     *
     * @param {string} filter a filter (analyzer) that is applied to each of the
     * generated tokens before they are passed to the actual phrase scorer.
     * @returns {DirectGenerator} returns `this` so that calls can be chained.
     */
    postFilter(filter) {
        this._body.post_filter = filter;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for the `direct_generator`
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch DSL
     */
    toJSON() {
        return this._body;
    }
}

module.exports = DirectGenerator;

},{"../core":82,"lodash.isnil":183}],176:[function(require,module,exports){
'use strict';

exports.AnalyzedSuggesterBase = require('./analyzed-suggester-base');

exports.TermSuggester = require('./term-suggester');
exports.DirectGenerator = require('./direct-generator');
exports.PhraseSuggester = require('./phrase-suggester');
exports.CompletionSuggester = require('./completion-suggester');

},{"./analyzed-suggester-base":173,"./completion-suggester":174,"./direct-generator":175,"./phrase-suggester":177,"./term-suggester":178}],177:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    consts: { SMOOTHING_MODEL_SET },
    util: { recursiveToJSON, invalidParam }
} = require('../core');

const AnalyzedSuggesterBase = require('./analyzed-suggester-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-phrase.html';

const invalidSmoothingModeParam = invalidParam(
    ES_REF_URL,
    'smoothing',
    SMOOTHING_MODEL_SET
);

/**
 * The phrase suggester adds additional logic on top of the `term` suggester
 * to select entire corrected phrases instead of individual tokens weighted
 * based on `ngram-language` models. In practice this suggester will be able
 * to make better decisions about which tokens to pick based on co-occurrence
 * and frequencies.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-phrase.html)
 *
 * @example
 * const suggest = esb.phraseSuggester(
 *     'simple_phrase',
 *     'title.trigram',
 *     'noble prize'
 * )
 *     .size(1)
 *     .gramSize(3)
 *     .directGenerator(esb.directGenerator('title.trigram').suggestMode('always'))
 *     .highlight('<em>', '</em>');
 *
 * @param {string} name The name of the Suggester, an arbitrary identifier
 * @param {string=} field The field to fetch the candidate suggestions from.
 * @param {string=} txt A string to get suggestions for.
 *
 * @throws {Error} if `name` is empty
 *
 * @extends AnalyzedSuggesterBase
 */
class PhraseSuggester extends AnalyzedSuggesterBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field, txt) {
        super('phrase', name, field, txt);
    }

    /**
     * Sets max size of the n-grams (shingles) in the `field`. If the field
     * doesn't contain n-grams (shingles) this should be omitted or set to `1`.
     *
     * Note: Elasticsearch tries to detect the gram size based on
     * the specified `field`. If the field uses a `shingle` filter the `gram_size`
     * is set to the `max_shingle_size` if not explicitly set.
     * @param {number} size Max size of the n-grams (shingles) in the `field`.
     * @returns {PhraseSuggester} returns `this` so that calls can be chained.
     */
    gramSize(size) {
        this._suggestOpts.gram_size = size;
        return this;
    }

    /**
     * Sets the likelihood of a term being a misspelled even if the term exists
     * in the dictionary. The default is `0.95` corresponding to 5% of the
     * real words are misspelled.
     *
     * @param {number} factor Likelihood of a term being misspelled. Defaults to `0.95`
     * @returns {PhraseSuggester} returns `this` so that calls can be chained.
     */
    realWordErrorLikelihood(factor) {
        this._suggestOpts.real_word_error_likelihood = factor;
        return this;
    }

    /**
     * Sets the confidence level defines a factor applied to the input phrases score
     * which is used as a threshold for other suggest candidates. Only candidates
     * that score higher than the threshold will be included in the result.
     * For instance a confidence level of `1.0` will only return suggestions
     * that score higher than the input phrase. If set to `0.0` the top N candidates
     * are returned. The default is `1.0`.
     *
     * @param {number} level Factor applied to the input phrases score, used as
     * a threshold for other suggest candidates.
     * @returns {PhraseSuggester} returns `this` so that calls can be chained.
     */
    confidence(level) {
        this._suggestOpts.confidence = level;
        return this;
    }

    /**
     * Sets the maximum percentage of the terms that at most considered to be
     * misspellings in order to form a correction. This method accepts a float
     * value in the range `[0..1)` as a fraction of the actual query terms or a
     * number `>=1` as an absolute number of query terms. The default is set
     * to `1.0` which corresponds to that only corrections with at most
     * 1 misspelled term are returned. Note that setting this too high can
     * negatively impact performance. Low values like 1 or 2 are recommended
     * otherwise the time spend in suggest calls might exceed the time spend
     * in query execution.
     *
     * @param {number} limit The maximum percentage of the terms that at most considered
     * to be misspellings in order to form a correction.
     * @returns {PhraseSuggester} returns `this` so that calls can be chained.
     */
    maxErrors(limit) {
        this._suggestOpts.max_errors = limit;
        return this;
    }

    /**
     * Sets the separator that is used to separate terms in the bigram field.
     * If not set the whitespace character is used as a separator.
     *
     * @param {string} sep The separator that is used to separate terms in the
     * bigram field.
     * @returns {PhraseSuggester} returns `this` so that calls can be chained.
     */
    separator(sep) {
        this._suggestOpts.separator = sep;
        return this;
    }

    /**
     * Sets up suggestion highlighting. If not provided then no `highlighted` field
     * is returned. If provided must contain exactly `pre_tag` and `post_tag` which
     * are wrapped around the changed tokens. If multiple tokens in a row are changed
     * the entire phrase of changed tokens is wrapped rather than each token.
     *
     * @param {string} preTag Pre-tag to wrap token
     * @param {string} postTag Post-tag to wrap token
     * @returns {PhraseSuggester} returns `this` so that calls can be chained.
     */
    highlight(preTag, postTag) {
        this._suggestOpts.highlight = { pre_tag: preTag, post_tag: postTag };
        return this;
    }

    /**
     * Checks each suggestion against the specified `query` to prune suggestions
     * for which no matching docs exist in the index. The collate query for
     * a suggestion is run only on the local shard from which the suggestion
     * has been generated from. The `query` must be specified, and it is run
     * as a [`template` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-template-query.html).
     *
     * The current suggestion is automatically made available as the
     * `{{suggestion}}` variable, which should be used in your query.
     * Additionally, you can specify a `prune` to control if all phrase
     * suggestions will be returned, when set to `true` the suggestions will
     * have an additional option `collate_match`, which will be true if matching
     * documents for the phrase was found, `false` otherwise. The default value
     * for prune is `false`.
     *
     * @example
     * const suggest = esb.phraseSuggester('simple_phrase', 'title.trigram')
     *     .size(1)
     *     .directGenerator(
     *         esb.directGenerator('title.trigram')
     *             .suggestMode('always')
     *             .minWordLength(1)
     *     )
     *     .collate({
     *         query: {
     *             inline: {
     *                 match: {
     *                     '{{field_name}}': '{{suggestion}}'
     *                 }
     *             }
     *         },
     *         params: { field_name: 'title' },
     *         prune: true
     *     });
     *
     * @param {Object} opts The options for `collate`. Can include the following:
     *   - `query`: The `query` to prune suggestions for which
     *      no matching docs exist in the index. It is run as a `template` query.
     *   - `params`: The parameters to be passed to the template. The suggestion
     *      value will be added to the variables you specify.
     *   - `prune`: When set to `true`, the suggestions will
     *      have an additional option `collate_match`, which will be true if matching
     *      documents for the phrase was found, `false` otherwise. The default value
     *      for prune is `false`.
     * @returns {PhraseSuggester} returns `this` so that calls can be chained.
     */
    collate(opts) {
        // Add an instance check here?
        // I wanted to use `SearchTemplate` here since the syntaqx is deceptively
        // similar. But not quite the same.
        // Adding a builder object called collate doesn't make sense either.
        this._suggestOpts.collate = opts;
        return this;
    }

    /**
     * Sets the smoothing model to balance weight between infrequent grams
     * (grams (shingles) are not existing in the index) and frequent grams
     * (appear at least once in the index).
     *
     * Three possible values can be specified:
     *   - `stupid_backoff`: a simple backoff model that backs off to lower order
     *     n-gram models if the higher order count is 0 and discounts the lower order
     *     n-gram model by a constant factor. The default `discount` is `0.4`.
     *     Stupid Backoff is the default model
     *   - `laplace`: a smoothing model that uses an additive smoothing where a
     *     constant (typically `1.0` or smaller) is added to all counts to balance weights,
     *     The default `alpha` is `0.5`.
     *   - `linear_interpolation`: a smoothing model that takes the weighted mean of the
     *     unigrams, bigrams and trigrams based on user supplied weights (lambdas).
     *     Linear Interpolation doesn’t have any default values.
     *     All parameters (`trigram_lambda`, `bigram_lambda`, `unigram_lambda`)
     *     must be supplied.
     *
     * @param {string} model One of `stupid_backoff`, `laplace`, `linear_interpolation`
     * @returns {PhraseSuggester} returns `this` so that calls can be chained.
     */
    smoothing(model) {
        if (isNil(model)) invalidSmoothingModeParam(model);

        const modelLower = model.toLowerCase();
        if (!SMOOTHING_MODEL_SET.has(modelLower)) {
            invalidSmoothingModeParam(model);
        }

        this._suggestOpts.smoothing = modelLower;
        return this;
    }

    /**
     * Sets the given list of candicate generators which produce a list of possible terms
     * per term in the given text. Each of the generators in the list are
     * called per term in the original text.
     *
     * The output of the generators is subsequently scored in combination with the
     * candidates from the other terms to for suggestion candidates.
     *
     * @example
     * const suggest = esb.phraseSuggester('simple_phrase', 'title.trigram')
     *     .size(1)
     *     .directGenerator([
     *         esb.directGenerator('title.trigram').suggestMode('always'),
     *         esb.directGenerator('title.reverse')
     *             .suggestMode('always')
     *             .preFilter('reverse')
     *             .postFilter('reverse')
     *     ]);
     *
     * @param {Array<DirectGenerator>|DirectGenerator} dirGen Array of `DirectGenerator`
     * instances or a single instance of `DirectGenerator`
     * @returns {PhraseSuggester} returns `this` so that calls can be chained.
     */
    directGenerator(dirGen) {
        // TODO: Do instance checks on `dirGen`
        this._suggestOpts.direct_generator = Array.isArray(dirGen)
            ? dirGen
            : [dirGen];

        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation for the `phrase suggester`
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch DSL
     */
    toJSON() {
        return recursiveToJSON(this._body);
    }
}

module.exports = PhraseSuggester;

},{"../core":82,"./analyzed-suggester-base":173,"lodash.isnil":183}],178:[function(require,module,exports){
'use strict';

const isNil = require('lodash.isnil');

const {
    consts: { SUGGEST_MODE_SET, STRING_DISTANCE_SET },
    util: { invalidParam }
} = require('../core');

const AnalyzedSuggesterBase = require('./analyzed-suggester-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-term.html';

const invalidSortParam = invalidParam(
    ES_REF_URL,
    'sort',
    "'score' or 'frequency'"
);
const invalidSuggestModeParam = invalidParam(
    ES_REF_URL,
    'suggest_mode',
    SUGGEST_MODE_SET
);
const invalidStringDistanceParam = invalidParam(
    ES_REF_URL,
    'string_distance',
    STRING_DISTANCE_SET
);

/**
 * The term suggester suggests terms based on edit distance.
 * The provided suggest text is analyzed before terms are suggested.
 * The suggested terms are provided per analyzed suggest text token.
 * The term suggester doesn’t take the query into account that is part of request.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-term.html)
 *
 * @example
 * const suggest = esb.termSuggester(
 *     'my-suggestion',
 *     'message',
 *     'tring out Elasticsearch'
 * );
 *
 * @param {string} name The name of the Suggester, an arbitrary identifier
 * @param {string=} field The field to fetch the candidate suggestions from.
 * @param {string=} txt A string to get suggestions for.
 *
 * @throws {Error} if `name` is empty
 *
 * @extends AnalyzedSuggesterBase
 */
class TermSuggester extends AnalyzedSuggesterBase {
    // eslint-disable-next-line require-jsdoc
    constructor(name, field, txt) {
        super('term', name, field, txt);
    }

    /**
     * Sets the sort to control how suggestions should be sorted per
     * suggest text term.
     *
     * Two possible values:
     *   - `score`: Sort by score first, then document frequency and
     *     then the term itself.
     *   - `frequency`: Sort by document frequency first, then similarity
     *     score and then the term itself.
     *
     * @param {string} sort Can be `score` or `frequency`
     * @returns {TermSuggester} returns `this` so that calls can be chained.
     * @throws {Error} If `sort` is neither `score` nor `frequency`.
     */
    sort(sort) {
        if (isNil(sort)) invalidSortParam(sort);

        const sortLower = sort.toLowerCase();
        if (sortLower !== 'score' && sortLower !== 'frequency') {
            invalidSortParam(sort);
        }

        this._suggestOpts.sort = sortLower;
        return this;
    }

    /**
     * Sets the suggest mode which controls what suggestions are included
     * or controls for what suggest text terms, suggestions should be suggested.
     *
     * Three possible values can be specified:
     *   - `missing`: Only provide suggestions for suggest text terms that
     *     are not in the index. This is the default.
     *   - `popular`:  Only suggest suggestions that occur in more docs
     *     than the original suggest text term.
     *   - `always`: Suggest any matching suggestions based on terms in the suggest text.
     *
     * @param {string} mode Can be `missing`, `popular` or `always`
     * @returns {TermSuggester} returns `this` so that calls can be chained.
     * @throws {Error} If `mode` is not one of `missing`, `popular` or `always`.
     */
    suggestMode(mode) {
        if (isNil(mode)) invalidSuggestModeParam(mode);

        const modeLower = mode.toLowerCase();
        if (!SUGGEST_MODE_SET.has(modeLower)) {
            invalidSuggestModeParam(mode);
        }

        this._suggestOpts.suggest_mode = modeLower;
        return this;
    }

    /**
     * Sets the maximum edit distance candidate suggestions can have
     * in order to be considered as a suggestion. Can only be a value
     * between 1 and 2. Any other value result in an bad request
     * error being thrown. Defaults to 2.
     *
     * @param {number} maxEdits Value between 1 and 2. Defaults to 2.
     * @returns {TermSuggester} returns `this` so that calls can be chained.
     */
    maxEdits(maxEdits) {
        this._suggestOpts.max_edits = maxEdits;
        return this;
    }

    /**
     * Sets the number of minimal prefix characters that must match in order
     * to be a candidate suggestions. Defaults to 1.
     *
     * Increasing this number improves spellcheck performance.
     * Usually misspellings don't occur in the beginning of terms.
     *
     * @param {number} len The number of minimal prefix characters that must match in order
     * to be a candidate suggestions. Defaults to 1.
     * @returns {TermSuggester} returns `this` so that calls can be chained.
     */
    prefixLength(len) {
        this._suggestOpts.prefix_length = len;
        return this;
    }

    /**
     * Sets the minimum length a suggest text term must have in order to be included.
     * Defaults to 4.
     *
     * @param {number} len The minimum length a suggest text term must have in order
     * to be included. Defaults to 4.
     * @returns {TermSuggester} returns `this` so that calls can be chained.
     */
    minWordLength(len) {
        this._suggestOpts.min_word_length = len;
        return this;
    }

    /**
     * Sets factor that is used to multiply with the `shards_size` in order to inspect
     * more candidate spell corrections on the shard level.
     * Can improve accuracy at the cost of performance. Defaults to 5.
     *
     * @param {number} maxInspections Factor used to multiple with `shards_size` in
     * order to inspect more candidate spell corrections on the shard level.
     * Defaults to 5
     * @returns {TermSuggester} returns `this` so that calls can be chained.
     */
    maxInspections(maxInspections) {
        this._suggestOpts.max_inspections = maxInspections;
        return this;
    }

    /**
     * Sets the minimal threshold in number of documents a suggestion should appear in.
     * This can be specified as an absolute number or as a relative percentage of
     * number of documents. This can improve quality by only suggesting high
     * frequency terms. Defaults to 0f and is not enabled. If a value higher than 1
     * is specified then the number cannot be fractional. The shard level document
     * frequencies are used for this option.
     *
     * @param {number} limit Threshold in number of documents a suggestion
     * should appear in. Defaults to 0f and is not enabled.
     * @returns {TermSuggester} returns `this` so that calls can be chained.
     */
    minDocFreq(limit) {
        this._suggestOpts.min_doc_freq = limit;
        return this;
    }

    /**
     * Sets the maximum threshold in number of documents a suggest text token can
     * exist in order to be included. Can be a relative percentage number (e.g 0.4)
     * or an absolute number to represent document frequencies. If an value higher
     * than 1 is specified then fractional can not be specified. Defaults to 0.01f.
     * This can be used to exclude high frequency terms from being spellchecked.
     * High frequency terms are usually spelled correctly on top of this also
     * improves the spellcheck performance. The shard level document frequencies are
     * used for this option.
     *
     * @param {number} limit Maximum threshold in number of documents a suggest text
     * token can exist in order to be included. Defaults to 0.01f.
     * @returns {TermSuggester} returns `this` so that calls can be chained.
     */
    maxTermFreq(limit) {
        this._suggestOpts.max_term_freq = limit;
        return this;
    }

    /**
     * Sets the string distance implementation to use for comparing how similar
     * suggested terms are.
     *
     * Five possible values can be specified:
     *   - `internal`: The default based on `damerau_levenshtein` but highly optimized for
     *     comparing string distance for terms inside the index.
     *   - `damerau_levenshtein`: String distance algorithm based on Damerau-Levenshtein
     *     algorithm.
     *   - `levenstein`: String distance algorithm based on Levenstein edit distance
     *     algorithm.
     *   - `jarowinkler`: String distance algorithm based on Jaro-Winkler algorithm.
     *   - `ngram`: String distance algorithm based on character n-grams.
     *
     * @param {string} implMethod One of `internal`, `damerau_levenshtein`, `levenstein`,
     * `jarowinkler`, `ngram`
     * @returns {TermSuggester} returns `this` so that calls can be chained.
     * @throws {Error} If `implMethod` is not one of `internal`, `damerau_levenshtein`,
     * `levenstein`, `jarowinkler` or ngram`.
     */
    stringDistance(implMethod) {
        if (isNil(implMethod)) invalidStringDistanceParam(implMethod);

        const implMethodLower = implMethod.toLowerCase();
        if (!STRING_DISTANCE_SET.has(implMethodLower)) {
            invalidStringDistanceParam(implMethod);
        }

        this._suggestOpts.string_distance = implMethodLower;
        return this;
    }
}

module.exports = TermSuggester;

},{"../core":82,"./analyzed-suggester-base":173,"lodash.isnil":183}],179:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],180:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],181:[function(require,module,exports){
/**
 * lodash 4.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/**
 * Gets the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias first
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the first element of `array`.
 * @example
 *
 * _.head([1, 2, 3]);
 * // => 1
 *
 * _.head([]);
 * // => undefined
 */
function head(array) {
  return (array && array.length) ? array[0] : undefined;
}

module.exports = head;

},{}],182:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap');

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' ||
        typeof value.splice == 'function' || isBuffer(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (nonEnumShadows || isPrototype(value)) {
    return !nativeKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEmpty;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],183:[function(require,module,exports){
/**
 * lodash 4.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 * @example
 *
 * _.isNil(null);
 * // => true
 *
 * _.isNil(void 0);
 * // => true
 *
 * _.isNil(NaN);
 * // => false
 */
function isNil(value) {
  return value == null;
}

module.exports = isNil;

},{}],184:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],185:[function(require,module,exports){
/**
 * lodash 4.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

module.exports = isString;

},{}],186:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeMax = Math.max;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property identifiers to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, props) {
  object = Object(object);
  return basePickBy(object, props, function(value, key) {
    return key in object;
  });
}

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property identifiers to pick from.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, props, predicate) {
  var index = -1,
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index],
        value = object[key];

    if (predicate(value, key)) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Creates an array of the own and inherited enumerable symbol properties
 * of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable string keyed properties of `object` that are
 * not omitted.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [props] The property identifiers to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = baseRest(function(object, props) {
  if (object == null) {
    return {};
  }
  props = arrayMap(baseFlatten(props, 1), toKey);
  return basePick(object, baseDifference(getAllKeysIn(object), props));
});

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = omit;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
