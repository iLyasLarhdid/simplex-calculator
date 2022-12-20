import logo from './logo.svg';
import './App.css';
import { Button, Container, Input, Table, TableBody, TableCell, TableHead } from '@mui/material';
import { useEffect, useState } from 'react';
import React from 'react';

const canGo = (row)=>{
  for(let i=0; i<row.length; i++){
    if(row[i]<0){
      return true;
    }
  }
  return false;
}

const getPivotColumn = (firstRow, numberOfExes)=>{
  let index = 1;
  let pivotColumn = firstRow[index];
  // first step is taking the column index of the smallest "x"
  // for i=1 to numberOfExes : if(pivotColumn > firstRow[i]){ pivotColumn = firstRow[i]; index=i}
  for(let i=1; i<=numberOfExes; i++){
    //console.log("if(",pivotColumn," > ",firstRow[i],"){ pivotColumn = firstRow[i]; index=",i,"}");
    if(pivotColumn > firstRow[i]){ pivotColumn = firstRow[i]; index=i}
  }
  return index;// in our example the index is 2 since -10 > -15
}
const getPivotRow = (arr, pivotColumn)=>{
  let arrLength = arr[0].length;
  let index = 2;
  let valueOfpivotRow = arr[index][arrLength-1]/pivotColumn[index];// pivotColumn = ["x2",20,19]
  //console.log("pivot column inside get row",pivotColumn);
  // first step is taking the row index of the smallest result/ valueOf(pivoteColumn[row])
  // for i=0 to pivotColumn.length : if(pivotColumn[i] !== 0 && valueOfpivotRow>arr[i][arrLength]/pivotColumn[i] ){valueOfpivotRow=arr[i][arrLength]; index=i;}
  for(let i=index; i<pivotColumn.length; i++){
    //console.log(arr[i]);
    //console.log("if(",pivotColumn[i]," !== 0 && ",valueOfpivotRow,">",arr[i][arrLength-1],"/",pivotColumn[i]," ){valueOfpivotRow=arr[i][arrLength]/pivotColumn[i]; index=",i,";}");
    if(pivotColumn[i] !== 0 && valueOfpivotRow>arr[i][arrLength-1]/pivotColumn[i] ){valueOfpivotRow=arr[i][arrLength-1]/pivotColumn[i]; index=i;}
  }
  return index; 
}
const changeOwnRow = (pivotRow, pivotValue)=>{//pivotRow = [0,5,19,0,1,0,10], pivotValue = 19
  pivotRow = pivotRow.map(val=>val!==0 ? val/pivotValue : val);
  //console.log(pivotRow);
  return pivotRow;
}

const changeOtherRows = (arr,newPivotRowValues,pivotRow,pivotCol)=>{// newPivotRowValues = [0,5,19,0,1,0,10] pivotRow is the index for skipping that column
  // row[] - row[pivotColumnIndex] * pivotRow // -2*400 + 1000
  //console.log(arr,"+++",newPivotRowValues);
  //arr.filter((key,val)=> val!==pivotRow && val!==0 ).map(row => row.map((v,k)=>console.log(arr[0][k],"/-",newPivotRowValues[k],"*",v,"+",row[pivotCol])));
  //const myArr = arr.filter((key,val)=> val!==pivotRow && val!==0 ).map(row => row.map((v,k)=>-newPivotRowValues[k]*row[pivotCol]+v));
  //const myArr = arr.map(row => row.map((v,k)=>-newPivotRowValues[k]*row[pivotCol]+v));
  //arr.map((k,v) => v!==pivotRow && v!==0 ?console.log("true",v,"/",k):console.log("false",v,"/",k));
  
  const myArr = arr.map((k,v) => v!==pivotRow && v!==0 ? k.map((val,key)=>-newPivotRowValues[key]*k[pivotCol]+val) :k);
  console.log("my arr",myArr);
  return myArr;
}
const calcItteraction = (numbOfExes, arr)=>{
  //the array will be like arr = [["z","x1","x2","e1","e2","e3","results"],[1,-10,-15,0,0,0,0],[0,15,20,1,0,0,10],[0,5,19,0,1,0,10],...];
  numbOfExes=3;
  const pivotColumn = getPivotColumn(arr[1],numbOfExes); // index of the column
  const pivotRow = getPivotRow(arr,arr.map(val=>val[pivotColumn]));
  console.log("pivotRow : ",pivotRow);
  console.log("pivotCol : ",pivotColumn);
  //rows other than pivot row are going to stay just like they are
  // then i devide all elemnts (except ones with ZERO) of pivotRow by the arr[pivotColumn][pivotRow]
  const newPivotRow = changeOwnRow(arr[pivotRow],arr[pivotRow][pivotColumn]);
  // every row other that the pivot row will be changed by arr[i] = arr.map(row=>row-arr[pivotRow][pivotColumn]
  arr = arr.map((k,v)=>v===pivotRow ? newPivotRow : k);
  arr = changeOtherRows(arr, newPivotRow,pivotRow,pivotColumn);
  return arr;
}

const calcSymplex = (numberOfExes)=>{
  let arr = [["z","x1","x2","e1","e2","results"],[1,-2,-3,0,0,0],[0,3,5,1,0,29],[0,2,1,0,1,10]];
  arr = [["z","x1","x2","x3","e1","e2","results"],[1,-7,-8,-10,0,0,0],[0,2,3,2,1,0,1000],[0,1,1,2,0,1,800]];
  // repeat while (canGo(row))
  while(canGo(arr[1])){
    console.log("//////////////////////////////////////////////////");
    arr = calcItteraction(numberOfExes, arr);
  }
  console.log("resultaaaaaaa" ,arr);
}


function App() {
  const [array, setArry] = useState([["z","x1","x2","x3","e1","e2","results"],[1,-7,-8,-10,0,0,0],[0,2,3,2,1,0,1000],[0,1,1,2,0,1,800]]);
  const [cols, setCols] = useState();
  const [numberOfConstraints, setNumberOfconstraints] = useState([0,0,0,0]);
  const [numberOfVariables, setNumberOfVariables] = useState([0,0,0,0]);
  
  // const getTableHead = ()=>{
  //   for(let i=0; i<cols; i++){
  //     if(i===0)
  //       ReactDOM.render(<th>Z</th>);
  //     else
  //       ReactDOM.render(<th>x{i}</th>);
      
  //   }
  // }
  const setNumber=(value,setter)=>{
    let arr = [];
    for(let i=0; i<value; i++){
      arr[i]=0;
    }
    setter(arr);
  }
  console.log("-----",numberOfConstraints,"/////",numberOfVariables);
  return (
    <div className="App">
      <Container>  
        <div>
          <div>Number of constraints: <input type="number" value={numberOfConstraints.length} onChange={(event)=>{setNumber(event.target.value,setNumberOfconstraints)}} min={2} /></div>
          Number of variables: <input type="number" value={numberOfVariables.length} onChange={(event)=>{setNumber(event.target.value,setNumberOfVariables)}} min={2} />
        </div>
        <div>
          <h3>Enter the values of the objective function:</h3>
          F(x) = 
          {numberOfVariables.map((elementInArray, i) => ( 
              <span key={`h${i}`}><input style={{ width:"2em" }}/> x{i} </span>
              ) 
          )}
        </div>
        <div>
          <h3>Enter the values of the system of constraints:</h3>
          {numberOfConstraints.map((elementInArray, i) => {
              return (
                <div key={`i${i}`} style={{ marginBottom:"1em" }}>
                {
                  numberOfVariables.map((elementInArray, j) => ( 
                    <span key={`j${j}`}><input style={{ width:"2em" }}/> x{j} </span>
                    ))
                }
                <select id="cars" name="cars" style={{ width:"3em", marginRight:"1em" }}>
                  <option value="audi">{"="}</option>
                  <option value="volvo">{"<"}</option>
                  <option value="saab">{">"}</option>
                  <option value="fiat">{"<="}</option>
                  <option value="audi">{">="}</option>
                </select>
                <input style={{ width:"2em" }}/>
                </div>
              )
            }
          )}
        </div>
        <div>
          <Button fullWidth variant='contained'>=</Button>
        </div>
      </Container>
    </div>
  );
}

export default App;
