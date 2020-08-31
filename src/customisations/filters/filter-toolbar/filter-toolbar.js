import React from 'react';

export class FilterToolbar extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            searchText: ''
        }
    }
    
    render() {
        const {classes, style: {height}, inputWidth, onHide} = this.props
        return (
            <div className={classes.FilterToolbar} style={{height}}>
                <div className={classes.filterButton} onClick={onHide}>
                    <i className="material-icons">filter_list</i>
                </div>
                <input className='search-text' style={{width: inputWidth}} type='text' value={this.state.searchText} onChange={e => this.handleSearchTextChange(e)} />
            </div>
        )
    }
    handleSearchTextChange(evt){
        const { value } = evt.target;
        let {searchText} = this.state;

        if (searchText && !value){

        } else if (value && !searchText){

        }
        this.setState({ searchText: value });
        this.props.onSearchText(value);
    }
    
}
