import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

class Donut extends React.Component {
    constructor(props){
        super(props);
        this.state={
            int:0, isVis: false
        }
    }
    componentDidUpdate(){
        if(this.state.isVis){
            let i = setInterval(()=> {
                if(this.state.int > this.props.per)
                     clearInterval(i);
                else{
                    this.state.int>0&&clearInterval(i);
                    this.setState({int:this.state.int+1})
                }
            }, 60);
        }
    }
    render(){
        return (<VisibilitySensor onChange={vis=>this.setState({isVis: vis})}>
        <div className="d-flex h-100 px-2" style={{backgroundColor:'rgb(243, 241, 241, .5)',borderRadius:20}}>
            <svg className="" height="100%" width="100%" viewBox="0 0 42 42">
                <circle r="15.91549430918954" cx="21" cy="21" fill="transparent" stroke="#d2d3d4" strokeWidth="4"/>
                <circle r="15.91549430918954" cx="-1" cy="21" fill="transparent"
                    stroke={this.props.color} strokeWidth="4"
                    strokeDasharray={`calc(${this.state.int} * 100 / 100) 100`}
                    transform="rotate(-90) translate(-20)" strokeDashoffset="0"/>
            </svg>
            <ul className="pl-1 align-self-center" style={{listStyle:'none',color:this.props.color}}>
                <li><h4>{this.props.label}</h4></li>
                <li><h5>{this.state.int}%</h5></li>
            </ul>
        </div>
        </VisibilitySensor>)
    }
}

export default Donut;