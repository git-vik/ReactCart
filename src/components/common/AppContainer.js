import React from 'react';
import JSONdata from '../../data';
import AlertContainer from 'react-alert';

class AppContainer extends React.Component{

    constructor(props) {
        super(props);

        if(localStorage.getItem("data")){
            this.state = JSON.parse(localStorage.getItem("data"));
        }else{
            let price = 0;
            let discount = 0;
            let typeDiscount = 0;
            let newData = JSONdata.slice(); // Making copy of array
            for(let i = 0; i < newData.length; i++){
                if( newData[i].count > 0 ){
                    discount += newData[i].discount*newData[i].count;
                    if( newData[i].type === 'fiction' ){
                        typeDiscount += Number((newData[i].price/100)*15)*newData[i].count;
                    }
                    price += newData[i].price*newData[i].count;
                }
            }

            let discountedPrice = price - discount - typeDiscount;

            this.state = {
                data: newData,
                itemsCount: newData.length,
                discount: discount,
                typeDiscount: typeDiscount,
                totalPrice: price,
                discountedPrice: discountedPrice
            };

            localStorage.setItem("data", JSON.stringify(this.state));
        }

        this.makeCartListing = this.makeCartListing.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.restoreData = this.restoreData.bind(this);
        this.clearLocalStorage = this.clearLocalStorage.bind(this);
        this.updateState = this.updateState.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.countItems = this.countItems.bind(this);
        this.deleteItem = this.deleteItem.bind(this);

    }

    updateState(){
        let price = 0;
        let discount = 0;
        let typeDiscount = 0;
        let data = this.state.data.slice();
        for(let i = 0; i < data.length; i++){
            if( data[i].count > 0 ){
                discount += data[i].discount*data[i].count;
                if( data[i].type === 'fiction' ){
                    typeDiscount += Number((data[i].price/100)*15)*data[i].count;
                }
                price += data[i].price*data[i].count;
            }
        }

        let discountedPrice = price - discount - typeDiscount;

        this.setState({
            discount: discount,
            typeDiscount: typeDiscount,
            totalPrice: price,
            discountedPrice: discountedPrice
        }, function(){
            localStorage.setItem("data", JSON.stringify(this.state));
        });
    }

    showAlert(message){
        this.msg.show(message, {
            time: 2000,
            type: 'success'
        });
    }

    countItems(){
        let count = 0;
        for(let i = 0; i < this.state.data.length; i++){
            count += this.state.data[i].count;
        }
        return count;
    }

    addItem(id){
        let data = this.state.data.slice();
        for(let i = 0; i < data.length; i++){
            if(data[i]['id'] === id){
               data[i]['count'] = data[i]['count'] + 1;
            }
        }
        this.setState({
            data: data
        }, function(){
            this.setState({
                itemsCount: this.countItems()
            }, function(){
                this.showAlert('Item added successfully');
                this.updateState();
            });
        });

    }

    removeItem(id){
        let data = this.state.data.slice();
        for(let i = 0; i < data.length; i++){
            if(data[i]['id'] === id){
                if( data[i]['count'] !== 0 ){
                    data[i]['count'] = data[i]['count'] - 1;
                    this.showAlert('Item removed successfully');
                }
            }
        }

        this.setState({
            data: data
        }, function(){
            this.setState({
                itemsCount: this.countItems()
            }, function(){
                this.updateState();
            });
        });
    }

    onItemCountChange(){
        // console.log('value changed');
    }

    deleteItem(id){
        let data = this.state.data.slice();
        for(let i = 0; i < data.length; i++){
            if(data[i]['id'] === id){
                data.splice(i, 1);
            }
        }

        this.setState({
            data: data
        }, function(){
            this.setState({
                itemsCount: this.countItems()
            }, function(){
                this.showAlert('Item deleted successfully');
                this.updateState();
            });
        });
    }

    makeCartListing(row, index){
        return (
            <tr key={row.id}>
                <td>
                    <div className="item">
                        <img className="placeholder" src={row.img_url} alt="" />
                        <p className="item-text">{row.name}</p>
                        <img src={require('../../../assets/img/cross.png')} onClick={this.deleteItem.bind(this, row.id)} className="item-remove" alt="" />
                    </div>
                </td>
                <td>
                    <div className="counter">
                        <img src={require('../../../assets/img/minus.png')} onClick={this.removeItem.bind(this, row.id)} className="minus" alt="minus" />
                        <input type="text" value={row.count} onChange={this.onItemCountChange.bind(this)} className="count" />
                        <img src={require('../../../assets/img/plus.png')} onClick={this.addItem.bind(this, row.id)} className="plus" alt="plus" />
                    </div>
                </td>
                <td>
                    <b className="price">${row.price}</b>
                </td>
            </tr>
        );
    }

    restoreData(){
        let price = 0;
        let discount = 0;
        let typeDiscount = 0;
        let dat = JSONdata.slice();
        for(let i = 0; i < dat.length; i++){
            if( dat[i].count > 0 ){
                discount += dat[i].discount*dat[i].count;
                if( dat[i].type === 'fiction' ){
                    typeDiscount += Number((dat[i].price/100)*15)*dat[i].count;
                }
                price += dat[i].price*dat[i].count;
            }
        }

        let discountedPrice = price - discount - typeDiscount;

        this.setState({
            data: dat,
            itemsCount: dat.length,
            discount: discount,
            typeDiscount: typeDiscount,
            totalPrice: price,
            discountedPrice: discountedPrice
        }, function(){
            localStorage.setItem("data", JSON.stringify(this.state));
        });
    }

    clearLocalStorage(){
        localStorage.setItem("data", null);
        this.restoreData();
    }

    render(){
        let alertOptions = {
            offset: 14,
            position: 'top right',
            theme: 'dark',
            time: 5000,
            transition: 'fade'
        };
        return (
            <div className="container">
                <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                <br/>
                <div className="header">
                    <img src={require('../../../assets/img/left-arrow.png')} alt="" />
                    <h1>Order Summary</h1>
                </div>
                <div className="column-one">
                    <table cellSpacing="0">
                        <thead>
                            <tr>
                                <th>Items({this.state.itemsCount})</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map(this.makeCartListing, this)}
                            <tr style={{textAlign: 'center'}}>
                                <td colSpan="3" className="lastRowTd">
                                    {
                                        this.state.data.length === 0 ?
                                            <button className="restoreCode" onClick={this.restoreData.bind(this)}>Restore Data</button>
                                             :
                                            ""
                                    }
                                    <button className="restoreCode" onClick={this.clearLocalStorage.bind(this)}>Refresh Local Storage</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="column-two">
                    <div className="order-summary">
                        <div className="no-pad">
                            <h2 className="order-summary-title">Total</h2>
                            <div className="row first-row">
                                <div className="col-one">
                                    <p>Items({this.state.itemsCount})</p>
                                </div>
                                <div className="col-two">
                                    <p><span className="colon">:</span>${this.state.totalPrice}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-one">
                                    <p>Discount</p>
                                </div>
                                <div className="col-two">
                                    <p><span className="colon">:</span>-${this.state.discount}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-one">
                                    <p>Type Discount</p>
                                </div>
                                <div className="col-two">
                                    <p><span className="colon">:</span>-${this.state.typeDiscount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="footer">
                            <div className="row">
                                <div className="col-one">
                                    <p>Order Total</p>
                                </div>
                                <div className="col-two">
                                    <p>${this.state.discountedPrice}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppContainer;
