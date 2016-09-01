'use strict';
var React = require('react');
var FilterActions = require('../../../actions/FilterActions');
var formatters = require('../../../utils/formatters.js');
var HelpTooltip = require('../../tooltips/HelpTooltip.js').HelpTooltip;
/**
 * @class OneChoiceFilter
 * @description Radio-button to select a unique value.
 *   Currently only used for "Variant type", and is almost a copy of TrueFalseAnyFilter.
 *   Make it more general if it applies to more things.
 */


class OneChoiceFilter extends React.Component {
    constructor(props) {
        super(props);
        /* Use props to init the internal state only */
        this.state = {value: props.value};
        this.onChange = this.onChange.bind(this);
    }
    /* Because the props might change as the result of another action, like changing the db,
     the state needs to be updated when props are received */
    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value});
    }

    onChange(e) {
        var value = e.target.value;
        if (value === 'any') {
            value = undefined;
        } else {
            value = value.toLowerCase();
        }
        this.setState({ value });  // change checked state right away
        FilterActions.updateOneFilterValue(this.props.field, value);
    }

    render() {
        if (! this.props.stats) {
            return <div></div>;
        }
        var stats = this.props.stats;
        var key = this.props.key;
        var value = this.state.value;
        var countBadge = function (option, val) {
            /* `option` is true or false or undefined; it represents one of the 3 check options.
             `val` is the current state of the choice - also true or false or undefined. */
            return (option !== val && option !== undefined && (stats[option] === undefined || stats[option] === 0)) ?
                <span></span> :
                <span className="badge count">{formatters.kmCount(stats[option] || 0)}</span>;
        };

        return (
            <div id={'one-filter-'+this.props.field} className="one-filter truefalseany-filter">
                <div className="filter-name">
                    {this.props.name}
                    <span style={{paddingLeft: '5px'}}>
                        <HelpTooltip name={this.props.field} category={'filters'} />
                    </span>
                </div>
                <div className="filter-input">

                    {/* TRUE */}

                    <div className="one-choice one-choice-true-false">
                        <div className="option-name">
                            <input
                                type="radio"
                                name={key}
                                checked={value === 'snp'}
                                onChange={this.onChange}
                                value="SNP"
                            />
                            <span> SNP</span>
                        </div>
                        <small className="true">
                            {countBadge('snp', value)}
                        </small>
                    </div>

                    {/* FALSE */}

                    <div className="one-choice one-choice-true-false">
                        <div className="option-name">
                            <input
                                type="radio"
                                name={key}
                                checked={value === 'indel'}
                                onChange={this.onChange}
                                value="Indel"
                            />
                            <span> indel</span>
                        </div>
                        <small className="false">
                            {countBadge('indel', value)}
                        </small>
                    </div>

                    {/* ANY */}

                    <div className="one-choice once-choice-any">
                        <div className="option-name">
                            <input
                                type="radio"
                                name={key}
                                checked={value === undefined}
                                onChange={this.onChange}
                                value="any"
                            />
                            <span> any</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = OneChoiceFilter;
