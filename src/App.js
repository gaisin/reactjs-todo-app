import React, { Component } from 'react';
import * as firebase from 'firebase';

import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';

const config = {
    apiKey: "AIzaSyDhVo3nGl5vxuDjQqGQFk3IW6FHaj0qOsE",
    authDomain: "todoapp-4e21b.firebaseapp.com",
    databaseURL: "https://todoapp-4e21b.firebaseio.com",
    projectId: "todoapp-4e21b",
    storageBucket: "todoapp-4e21b.appspot.com",
    messagingSenderId: "231238766598"
};

firebase.initializeApp(config);

const db = firebase.database();
const rootRef = db.ref().child('todoes');

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [],
        };
    };

    componentDidMount() {
        rootRef.on('value', snapshot => {
            const arrayOfTodoes = [];

            snapshot.forEach(function(item) {
                let newItem = {
                    id: item.key,
                    // id: item.val().id,
                    label: item.val().label,
                    isDone: item.val().isDone
                }
                arrayOfTodoes.push(newItem);
            });

            this.setState({
                items: arrayOfTodoes,
            })
        });
    };

    handleItemChangeState = (itemId) => {
        this.changeEditState(itemId);
    };

    changeEditState = (itemId) => {
        this.state.items.map((item) => {
            if (item.id === itemId) {
                if (item.isDone) {
                    rootRef.child(item.id).update({
                        isDone: false,
                    })
                } else {
                    rootRef.child(item.id).update({
                        isDone: true,
                    })
                }
            };
            return null;
        });
    };

    handleItemRemove = (itemId) => {
        rootRef.child(itemId).remove();
    };

    handleNewItemSubmit = (item) => {
        rootRef.push().set(item);
    };

    handleItemChangeLabelSubmit = (itemToChange, newLabelValue) => {
        rootRef.child(itemToChange.id).update({
            label: newLabelValue,
        })
    };

    render() {
        return (
            <div className="container font-kreon">
                <div className="page-header">
                    <h1 className="text-center">To-Do list</h1>
                </div>
                <ItemList 
                    items={this.state.items}
                    handleItemChangeState={this.handleItemChangeState}
                    handleItemRemove={this.handleItemRemove}
                    handleItemChangeLabel={this.handleItemChangeLabel}
                    handleItemChangeLabelSubmit={this.handleItemChangeLabelSubmit}
                    handleItemChangeLabelCancel={this.handleItemChangeLabelCancel}
                />
                <ItemAddForm
                    handleItemSubmit={this.handleNewItemSubmit}
                />
            </div>
        );
    }
}


class ItemList extends Component {

    render() {
        const items = this.props.items.map((item) => (
            <EditableItem
                key={'editable-item'+item.id}
                item={item}
                handleItemChangeState={this.props.handleItemChangeState}
                handleItemChangeLabel={this.props.handleItemChangeLabel}
                handleItemRemove={this.props.handleItemRemove}
                handleItemChangeLabelSubmit={this.props.handleItemChangeLabelSubmit}
                handleItemChangeLabelCancel={this.props.handleItemChangeLabelCancel}
            />
        ));

        const sorted_items = items.sort((a,b) => {
            return a.props.item.isDone - b.props.item.isDone
        });

        return (
            <div className="row">
                <div className="col-md-6 col-md-offset-3 col-xs-12">
                    <ul className="list-group">
                    {sorted_items}  
                    </ul>
                </div> 
            </div>
        )
    }
}


class EditableItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            onEdit: false,
        }

    };

    handleItemChangeLabel = () => {
        this.changeEditState();
    };

    changeEditState = () => {
        if (this.state.onEdit === false) {
            this.setState({
                onEdit: true,
            })
        } else {
            this.setState({
                onEdit: false,
            })
        }
    };

    handleItemChangeLabelCancel = () => {
        this.changeEditState();
    };

    handleItemChangeLabelSubmit = (itemToChange, newLabelValue) => {
        this.props.handleItemChangeLabelSubmit(itemToChange, newLabelValue);
        this.changeEditState();
    };

    render() {
        if (this.state.onEdit===false) {
            return (
                <Item
                    key={'item-'+this.props.item.id}
                    id={this.props.item.id}
                    label={this.props.item.label}
                    isDone={this.props.item.isDone}

                    onChangeState={this.props.handleItemChangeState}
                    // onChangeLabel={this.props.handleItemChangeLabel}
                    onChangeLabel={this.handleItemChangeLabel}
                    onRemove={this.props.handleItemRemove}
                />
            )
        } else {
            return (
                <ItemForm
                    key={'item-'+this.props.item.id}
                    id={this.props.item.id}
                    label={this.props.item.label}
                    isDone={this.props.item.isDone}

                    onSubmitLabel={this.handleItemChangeLabelSubmit}
                    onCancelLabel={this.handleItemChangeLabelCancel}
                />
            )
        }
    }
}


class Item extends Component {

    handleItemRemove = () => {
        this.props.onRemove(this.props.id)
    };

    handleItemChangeLabel = () => {
        this.props.onChangeLabel(this.props.id)
    };

    handleItemChangeState = () => {
        this.props.onChangeState(this.props.id)
    };

    render () {
        if (this.props.isDone===false) {

            return (
                // <li className="list-group-item">
                <div className="row" style={{marginBottom: 10}}>
                    <div className="col-xs-1">
                        <Checkbox
                            checked={false}
                            onCheck={this.handleItemChangeState}
                        />
                    </div>
                    <div className="col-xs-10">
                        {this.props.label}
                    </div>
                    <div className="col-xs-1 text-center">
                        <IconMenu
                            iconButtonElement={
                                <IconButton
                                    iconClassName="material-icons"
                                    style={{padding:0, margin: 0,textAlign: "left", width: 36, height: 36}}
                                    iconStyle={{padding:0, margin: 0,textAlign: "left"}}
                                >
                                    <i className="fas fa-ellipsis-v"></i>
                                </IconButton>
                            }
                            style={{padding:0, margin: 0, border: 0}}
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        >
                            <MenuItem 
                                primaryText="Edit"
                                onClick={this.handleItemChangeLabel}
                            />
                            <MenuItem 
                                primaryText="Remove" 
                                onClick={this.handleItemRemove}
                            />
                        </IconMenu>
                    </div>
                </div>
                // </li>
            )
        } else {
            return (
                // <li className="list-group-item">
                <div className="row"  style={{marginBottom: 5}}>
                    <div className="col-md-1 col-xs-1">
                        <Checkbox
                            checked={true}
                            onCheck={this.handleItemChangeState}
                        />
                    </div>
                    <div className="col-md-10 col-xs-10" style={{textDecoration: "line-through"}}>
                        {this.props.label}
                    </div>
                    <div className="col-md-1 col-xs-1">
                        <IconMenu
                            iconButtonElement={
                                <IconButton
                                    iconClassName="material-icons"
                                    style={{padding:0, margin: 0,textAlign: "left", width: 36, height: 36}}
                                    iconStyle={{padding:0, margin: 0,textAlign: "left"}}
                                >
                                    <i className="fas fa-ellipsis-v"></i>
                                </IconButton>
                            }
                            style={{padding:0, margin: 0, border: 0}}
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        >
                            <MenuItem 
                                primaryText="Edit" 
                                onClick={this.handleItemChangeLabel}
                            />
                            <MenuItem 
                                primaryText="Remove" 
                                onClick={this.handleItemRemove} 
                            />
                        </IconMenu>
                    </div>
                </div>
                // </li>
            )
        }
        
    }
}


class ItemForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            label: '',
        };
    };

    componentDidMount() {
        this.setState({
            label: this.props.label,  
        })
    }

    handleInputLabelChange = (e) => {
        this.setState({
            label: e.target.value,
        });
    };

    handleItemChangeLabelSubmit = () => {
        this.props.onSubmitLabel(this.props, this.state.label);
    };

    handleItemChangeLabelCancel = () => {
        this.props.onCancelLabel(this.props.id);
    };

    render() {
        return (
            <div className="row" style={{marginBottom: 5}}>
                <div className="col-md-8 col-xs-12" style={{marginTop: -10}}>
                    <TextField
                        value={this.state.label}
                        fullWidth={true}
                        multiLine={true}
                        onChange={this.handleInputLabelChange}
                        onKeyPress={ (e) => {
                            if (e.key === 'Enter') {
                                this.props.onSubmitLabel(this.props, this.state.label);
                            }
                            }
                        }   
                    />
                </div>
                <div className="col-md-2 col-xs-6">
                    <RaisedButton 
                        label="Submit"
                        onClick={this.handleItemChangeLabelSubmit}
                    />
                </div>
                <div className="col-md-2 col-xs-6">
                    <RaisedButton 
                        label="Cancel"
                        onClick={this.handleItemChangeLabelCancel}
                    />
                </div>
            </div>
        )
    }
}


class ItemAddForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            label: '',
        };
    };

    handleLabelChange = (e) => {
        this.setState({
            label: e.target.value,
        });
    };

    handleNewItemSubmit = () => {
        if (this.state.label!=="") {
            this.props.handleItemSubmit({
                id: +new Date(),
                label: this.state.label,
                isDone: false,
            });
            this.setState({ label: '' });
        }
    };

    handleItemSubmitByEnter = (e) => {
        if (e.charCode===13) {
            if (this.state.label!=="") {
                this.props.handleItemSubmit({
                    id: +new Date(),
                    label: this.state.label,
                    isDone: false,
                });
                this.setState({ label: '' });
            }
        }
    };

    render () {
        return (
            <div className="row">
                <div className="col-md-5 col-md-offset-3 col-xs-12 text-center" style={{}}>
                    <TextField
                        value={this.state.label}
                        fullWidth={true}
                        onKeyPress={ (e) => {
                            if (e.key === 'Enter') {
                                this.handleNewItemSubmit();
                            }
                        }}   
                        onChange={this.handleLabelChange}
                        hintText="Add a new to-do"
                    />
                </div>
                <div className="col-md-1 col-xs-12 text-center">
                    <RaisedButton 
                        label="Add"
                        onClick={this.handleNewItemSubmit}
                    />
                </div>
            </div>
        )
    }
}


export default Dashboard;
