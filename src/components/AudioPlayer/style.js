export default `
<style>

#title {
    pointer-events: none;
    user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
}

#gain-value {
position:absolute
}

#root {
    margin-bottom: 5%;
    margin-left:30px;
    margin-top:30px;
    color:white;
    background-image: url("./assets/imgs/baground.jpeg");
    height: 500px;
    width:auto;
    height:auto;
    display: inline-block;
    padding:10px;
    border-radius: 10px;
    border: solid #d3fffd 1px;
    box-shadow: #7A7A7A40 0px 5px 15px;
}

:focus { outline: none; }

#equalizer {
    justify-content: center;
    display:flex;
    flex-flow: row wrap;
}

#equalizer-inputs {
    margin-left:10px;
    margin-top:5px;
}

#title {
}

canvas {
    width:400px;
    height:300px;
    background-color: black;
    border: white solid 2px;
    margin-top:10px;
}

a {
color:white;
}

  #hz-value {
        display: inline-block;
        width: 150px;
        text-align: right;
      }
      
  .switch {
  position: absolute;
  margin-top:50px;
  margin-left:10px;
  display: inline-block;
  width: 60px;
  height: 34px;
  display: none;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  z-index: 10;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.canvas-wrapper {
position:relative;
}

#frequencies-visualization {
position:absolute;
left:0px;
z-index: 2;
}

#wave-form {
z-index: 7;
}

</style>
`
