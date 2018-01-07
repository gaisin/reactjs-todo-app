import React, { Component } from 'react';
import * as firebase from 'firebase';

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
        console.log('pulling handleItemChangeState from Dashboard');

        this.changeEditState(itemId);

        // old code without firebase
        // const nextItems = this.state.items.map((item) => {
        //     if (item.id === itemId) {
        //         if (item.isDone) {
        //             return Object.assign({}, item, {
        //                 isDone: false,
        //             });
        //         } else {
        //             return Object.assign({}, item, {
        //                 isDone: true,
        //             });
        //         }
        //     } else {
        //         return item;
        //     }
        // });
        // this.setState({
        //     items: nextItems,
        // })
    };

    changeEditState = (itemId) => {
        console.log('changeEditState from Dashboard');

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
        console.log('pulling handleItemRemove from Dashboard, itemId='+itemId);
        rootRef.child(itemId).remove();
    };

    handleNewItemSubmit = (item) => {
        console.log('pulling handleNewItemSubmit from Dashboard')
        rootRef.push().set(item);

        // old code without firebase
        // this.setState({
            // items: this.state.items.concat(item),
        // });
    };

    handleItemChangeLabelSubmit = (itemToChange, newLabelValue) => {
        console.log('pulling handleItemChangeLabelSubmit from Dashboard')

        rootRef.child(itemToChange.id).update({
            label: newLabelValue,
        })

        // old code without firebase
        // const nextItems = this.state.items.map((item) => {
        //     if (item.id === itemToChange.id) {
        //         return Object.assign({}, item, {
        //             label: newLabelValue,
        //             onEdit: false,
        //         });
        //     } else {
        //         return item;
        //     }
        // });
        // this.setState({
        //     items: nextItems,
        // });
    };

    render() {
        return (
            <div className="container font-kreon">
                <div className="page-header">
                    <h1 className="text-center">TODO-list</h1>
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

        return (
            <div className="row">
                <div className="col-xs-6 col-xs-offset-3 list-group">
                    {items}
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
        console.log('pulled handleItemChangeLabel from EditableItem');
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
        console.log('pulled handleItemChangeLabelCancel from EditableItem');
        this.changeEditState();
    };

    handleItemChangeLabelSubmit = (itemToChange, newLabelValue) => {
        console.log('pulled handleItemChangeLabelSubmit from EditableItem');
        this.props.handleItemChangeLabelSubmit(itemToChange, newLabelValue);
        this.changeEditState();
    };

    render() {
        // if (this.props.item.onEdit===false) {
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
        console.log('pulling handleItemRemove from Item')
        this.props.onRemove(this.props.id)
    };

    handleItemChangeLabel = () => {
        console.log('pulling handleItemChangeLabel from Item')
        this.props.onChangeLabel(this.props.id)
    };

    handleItemChangeState = () => {
        console.log('pulling handleItemChangeState from Item');
        this.props.onChangeState(this.props.id)
    };

    render () {
        if (this.props.isDone===false) {
            return (
                    <div className="list-group-item font-kreon-bold">
                        <span className="badge">
                            <span 
                                className="glyphicon glyphicon-remove" 
                                onClick={this.handleItemRemove} 
                                aria-hidden="true">
                            </span>
                        </span>
                        <span className="badge">
                            <span 
                                className="glyphicon glyphicon-edit" 
                                onClick={this.handleItemChangeLabel}
                                aria-hidden="true">
                            </span>
                        </span>
                        <span className="badge">
                            <span 
                                className="glyphicon glyphicon-ok" 
                                onClick={this.handleItemChangeState}
                                aria-hidden="true">
                            </span>
                        </span>
                        <b>{this.props.label}</b>
                    </div>
            )
        } else {
            return (
                    <div className="list-group-item done font-kreon-light">
                        <span className="badge">
                            <span 
                                className="glyphicon glyphicon-remove" 
                                onClick={this.handleItemRemove} 
                                aria-hidden="true">
                            </span>
                        </span>
                        <span className="badge">
                            <span 
                                className="glyphicon glyphicon-edit" 
                                onClick={this.handleItemChangeLabel}
                                aria-hidden="true">
                            </span>
                        </span>
                        <span className="badge">
                            <span 
                                className="glyphicon glyphicon-repeat" 
                                onClick={this.handleItemChangeState}
                                aria-hidden="true">
                            </span>
                        </span>
                        {this.props.label}
                    </div>
            )
        }
        
    }
}


class ItemForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            label: this.props.label,
        };
    };

    handleInputLabelChange = (e) => {
        this.setState({
            label: e.target.value,
        });
    };

    handleItemChangeLabelSubmitByEnter = (e) => {
        if (e.charCode===13) {
            console.log('pulling handleItemChangeLabelSubmitByEnter from ItemForm');
            this.props.onSubmitLabel(this.props, this.state.label);
        }
    };

    handleItemChangeLabelSubmit = () => {
        console.log('pulling handleItemChangeLabelSubmit from ItemForm');
        this.props.onSubmitLabel(this.props, this.state.label);
    };

    handleItemChangeLabelCancel = () => {
        console.log('pulling handleItemChangeLabelCancel from ItemForm');
        this.props.onCancelLabel(this.props.id);
    };

    render() {
        return (
            <div className="list-group-item font-kreon-bold">
                <div className="row">
                    <div className="col-xs-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            value={this.state.label} 
                            onChange={this.handleInputLabelChange} 
                            onKeyPress={this.handleItemChangeLabelSubmitByEnter}
                            ref="inpt" 
                        />
                    </div>
                    <div className="col-xs-2">
                        <span className="badge">
                            <span 
                                className="glyphicon glyphicon-ok" 
                                onClick={this.handleItemChangeLabelSubmit}
                                aria-hidden="true">
                            </span>
                        </span>
                        <span className="badge">
                            <span 
                                className="glyphicon glyphicon-remove" 
                                onClick={this.handleItemChangeLabelCancel} 
                                aria-hidden="true">
                            </span>
                        </span>
                    </div>
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
            console.log('pulling handleNewItemSubmit from ItemAddForm');
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
                console.log('pulling handleItemSubmit from ItemAddForm');
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
                <div className="col-xs-6 col-xs-offset-3 text-center">
                    <div className="input-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            value={this.state.label} 
                            placeholder="Type your task" 
                            onChange={this.handleLabelChange} 
                            ref="inpt" 
                            onKeyPress={this.handleItemSubmitByEnter}
                        />
                        <span className="input-group-btn">
                            <button 
                                className="btn btn-default" type="button" 
                                onClick={this.handleNewItemSubmit}
                            >
                                Add To-Do
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}


export default Dashboard;
