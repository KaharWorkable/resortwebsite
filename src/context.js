import React, { Component } from 'react';
import items from './data';
const RoomContext= React.createContext();


class RoomProvider extends Component {
  state = {
    rooms: [],
    sortedRooms: [],
    featuredRRooms: [],
    loading: true,
    type: "all",
    capacity: 1,
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    minSize: 0,
    maxSize:  0,
    breakfast: false,
    pets: false
  };
  // getData
componentDidMount(){
  //this.getData
  let rooms = this.formatData(items);
  let featuredRRooms = rooms.filter(room => room.featured === true);
  let maxPrice = Math.max(...rooms.map(item => item.price));
  let maxSize = Math.max(...rooms.map(item => item.size));
  this.setState({
    rooms,
    featuredRRooms,
    sortedRooms: rooms,
    loading: false,
    price: maxPrice,
    maxPrice,
    maxSize
  });
}

formatData(items){
  let tempItems = items.map(items =>{
    let id = items.sys.id
    let images = items.fields.images.map(image => image.fields.file.url);
    let room = {...items.fields, images:images, id}
    return room;
  });
  return tempItems;
}

getRoom = slug =>{
  let tempRooms = [...this.state.rooms];
  const room = tempRooms.find(room => room.slug===slug)
  return room;
}
handleChange = event => {
  const target = event.target
  const value = event.type === 'checkbox' ?target.checked : target.value;
  const name = event.target.name
  this.setState(
    {[name]:value
    },
    this.filterRooms
  );
}

filterRooms = () => {
  let{
    rooms, type, capacity, price, minSize, maxSize, breakfast, pets
  } = this.state

  let tempRooms = [...rooms];
  if(type !== 'all'){
    tempRooms = tempRooms.filter(room => room.type === type)
  }
this.setState({
  sortedRooms:tempRooms
})
};


  render() {
    return <RoomContext.Provider value={{...this.state,
     getRoom:this.getRoom,
      handleChange:this.handleChange}}>
      {this.props.children}
    </RoomContext.Provider>;
  }
}



const RoomConsumer = RoomContext.Consumer;

export function withRoomConsumer(Component){
  return function ConsumerWrapper(props){
    return <RoomConsumer>
      {value => <Component {...props} context={value}/>}
    </RoomConsumer>
  }
};

export{RoomProvider, RoomConsumer, RoomContext};
