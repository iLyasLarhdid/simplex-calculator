import './App.css';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';
import React from 'react';

const canGo = (row,numberOfExes)=>{
  for(let i=1; i<=numberOfExes; i++){
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
  
  const myArr = arr.map((k,v) => v!==pivotRow && v!==0 ? k.map((val,key)=>-newPivotRowValues[key]*parseFloat(k[pivotCol])+parseFloat(val)) :k);
  return myArr;
}
const calcItteraction = (numbOfExes, arr)=>{
  //the array will be like arr = [["z","x1","x2","e1","e2","e3","results"],[1,-10,-15,0,0,0,0],[0,15,20,1,0,0,10],[0,5,19,0,1,0,10],...];
  const pivotColumn = getPivotColumn(arr[1],numbOfExes); // index of the column
  const pivotRow = getPivotRow(arr,arr.map(val=>val[pivotColumn]));
  console.log("pivotRow : ",pivotRow);
  console.log("pivotCol : ",pivotColumn,' pivot value :',arr[pivotRow][pivotColumn]);
  //rows other than pivot row are going to stay just like they are
  // then i devide all elemnts (except ones with ZERO) of pivotRow by the arr[pivotColumn][pivotRow]
  const newPivotRow = changeOwnRow(arr[pivotRow],arr[pivotRow][pivotColumn]);
  // every row other that the pivot row will be changed by arr[i] = arr.map(row=>row-arr[pivotRow][pivotColumn]
  arr = arr.map((k,v)=>v===pivotRow ? newPivotRow : k);
  arr = changeOtherRows(arr, newPivotRow,pivotRow,pivotColumn);
  console.log("my arr",arr);
  return arr;
}

const calcSymplex = (numberOfExes, arr)=>{
  // repeat while (canGo(row))
  while(canGo(arr[1],numberOfExes)){
    console.log("//////////////////////////////////////////////////");
    arr = calcItteraction(numberOfExes, arr);
  }
  console.log("resultaaaaaaa" ,arr);
  return arr;
}

const getResults = (arr, numberOfExes)=>{
  let results = {};
  let arrSize = arr[0].length;
  results['z'] = arr[1][arrSize-1];

  for(let i=1; i<=numberOfExes; i++){//the question you need to ask now is 'if we found 1 should we stop and get the result... or continue looking for other numbers.
    results[`x${i}`]=0
    for(let j=1; j<arr.length; j++){
      console.log('i++++++'+arrSize+'++arrji['+j+']['+i+']++');
      if(arr[j][i] === 1){
        results[`x${i}`] = arr[j][arrSize-1];
        break;
      }
    }
    // if(counter===1){
    //   if(i<=numberOfExes){//all x's
    //     results[`x${i}`] = arr[i][arrSize-1];
    //   }
    //   else if(i!==arrSize-1){////all e's
    //     results[`e${i-numberOfExes}`] = arr[i][arrSize-1];
    //   }
    // }
    // else{
    //   if(i<=numberOfExes){//all x's
    //     results[`x${i}`] = 0;
    //   }
    //   else if(i!==arrSize-1){////all e's
    //     results[`e${i-numberOfExes}`] = 0;
    //   }
    // }
    console.log(results,'+rrrrrrrrrrrrrrrrrrrrrrrrr+');
  }
  for(let i=numberOfExes+1; i<arrSize-1; i++){
    results[`e${i-numberOfExes}`] = arr[1][i];
  }
  
  return results;
}

const calc =(table)=>{
  const arr = [];
  //let arr = [["z","x1","x2","e1","e2","results"],[1,-2,-3,0,0,0],[0,3,5,1,0,29],[0,2,1,0,1,10]];
  //arr = [["z","x1","x2","x3","e1","e2","results"],[1,-7,-8,-10,0,0,0],[0,2,3,2,1,0,1000],[0,1,1,2,0,1,800]];
  //arr = [["z","x1","x2","e1","e2","e3","results"],[1,-15,-10,0,0,0,0],[0,1,2,1,0,0,24],[0,2,1,0,1,0,45],[0,1,3,0,0,1,30]];
  const numberOfExes = table[0].length;
  const numOfConstraints = table.length-1;
  const numOfCols = table[0].length+table.length;
  const numOfRows = table.length;
  console.log(numOfRows,'------------',table,'------------',numOfCols);
  for(let i=0;i<=numOfRows;i++){
    arr[i]=[];
    for(let j=0;j<=numOfCols;j++){
      if(i===0){
        if(j===0){
          arr[i][j]='z';
        }
        else if(j<=numberOfExes){
          arr[i][j]='x'+j;
        }
        else if(j===numOfCols){
          arr[i][j]='results';
        }
        else{
          arr[i][j]='e'+(j-numberOfExes);
        }
      }
      else if(i===1){
        if(j===0){
          arr[i][j]=1;
        }
        else if(j<=numberOfExes){
          arr[i][j]=-table[0][j-1];
        }
        else{
          arr[i][j]=0;
        }
      }
      else{
        if(j===0){
          arr[i][j]=0;
        }
        else if(j<=numberOfExes){
          arr[i][j]=table[i-1][j-1];
        }
        else if(j===numOfCols){
          arr[i][j]=table[i-1][table[i-1].length-1];  
        }
        else if(i-1===j-numberOfExes){
          arr[i][j]=1;  
        }
        else{
          arr[i][j]=0;
        }
      }
    }
  }
  console.log('cccccccccccccc',arr,'--numberOfExes--',numberOfExes,'--numOfConstraints--',numOfConstraints);
  //let art = [["z","x1","x2","e1","e2","e3","results"],[1,-15,-10,0,0,0,0],[0,1,2,1,0,0,24],[0,2,1,0,1,0,45],[0,1,3,0,0,1,30]];
  const result = calcSymplex(numberOfExes,arr);
  return getResults(result,numberOfExes);
}


function App() {
  //const [array, setArry] = useState([["z","x1","x2","x3","e1","e2","results"],[1,-7,-8,-10,0,0,0],[0,2,3,2,1,0,1000],[0,1,1,2,0,1,800]]);
  const [variables, setVariables] = useState([0,0,0,0]);
  const [constraints, setConstraints] = useState([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
  const [numberOfConstraints, setNumberOfconstraints] = useState([0,0,0,0]);
  const [numberOfVariables, setNumberOfVariables] = useState([0,0,0,0]);
  const [results, setResults] = useState();
  // const getTableHead = ()=>{
  //   for(let i=0; i<cols; i++){
  //     if(i===0)
  //       ReactDOM.render(<th>Z</th>);
  //     else
  //       ReactDOM.render(<th>x{i}</th>);
      
  //   }
  // }

  const setVarNumber=(value)=>{
    let arr = [];
    for(let i=0; i<value; i++){
      arr[i]=0;
      // if(variables.length<=i){
      //   setVariables(old=>[...old,0]);
      // }
    }
    setVariables(old=>arr);
    setConstraints([arr]);
    for(let i=1; i<numberOfConstraints.length; i++){
      setConstraints(old=>[...old,arr]);
    }
    setNumberOfVariables(arr);
    setResults();
  }

  const setConstNumber=(value)=>{
    let arr = [];
    for(let i=0; i<value; i++){
      arr[i]=0;
      // if(constraints.length<=i){
      //   setConstraints(old=>[...old,variables.map(item=>0)]);
      // }
    }
    setConstraints(arr.map(item=>variables.map(i=>0)));
    setNumberOfconstraints(arr);
    setResults();
  }
  
  return (
    <div className="App">
      <Container>  
        <div>
          <div>Number of constraints: <input type="number" value={numberOfConstraints.length} onChange={(event)=>{setConstNumber(event.target.value)}} min={2} /></div>
          Number of variables: <input type="number" value={numberOfVariables.length} onChange={(event)=>{setVarNumber(event.target.value)}} min={2} />
        </div>
        <div>
          <h3>Enter the values of the objective function:</h3>
          F(x) = 
          {numberOfVariables.map((elementInArray, i) => ( 
              <span key={`h${i}`}>
                <input 
                  style={{ width:"3em" }} 
                  value={variables[i]!==undefined ? variables[i]:""} 
                  onChange={(event)=>setVariables(old=>old.length!==0?old.map((item,index)=>index===i?event.target.value:item):[event.target.value])}
                  />
                  {` x${i} `}
                </span>
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
                    <span key={`j${j}`}>
                      <input 
                        style={{ width:"3em" }} 
                        value={constraints[i][j]!==undefined ? constraints[i][j]:""}
                        onChange={(event)=>setConstraints(old=>old.length!==0?old.map((item,index)=>index===i?old[i].length!==0?old[i].map((item,index)=>index===j?event.target.value:item):[event.target.value]:item):[event.target.value])}
                      
                      /> 
                        {` x${j} `}
                      </span>
                    ))
                }
                <select id="cars" name="cars" style={{ width:"3em", marginRight:"1em" }}>
                  <option value="audi">{"="}</option>
                  <option value="volvo">{"<"}</option>
                  <option value="saab">{">"}</option>
                  <option value="fiat">{"<="}</option>
                  <option value="audi">{">="}</option>
                </select>
                <input 
                  style={{ width:"2em" }} 
                  value={constraints[i][numberOfVariables.length]!==undefined ? constraints[i][constraints[0].length]:""}
                  onChange={(event)=>setConstraints(old=>{
                    let myarr = [...old];
                    myarr[i][numberOfVariables.length] = event.target.value;
                    return myarr;
                  })}
                  
                />
                </div>
              )
            }
          )}
        </div>
        <div>
          <Button fullWidth variant='contained' onClick={()=>setResults(calc([variables,...constraints]))}>=</Button>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Variable</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {results && Object.keys(results).map(keys=>{
              return <TableRow><TableCell>{keys}</TableCell><TableCell>{results[keys]}</TableCell></TableRow>
            })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default App;
