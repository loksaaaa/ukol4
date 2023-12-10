import { Card, List, Button } from "antd";
import { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import mockData from "../mock/shoppingLists"
let data = mockData.shoppinglists;

function ShoppingLists() {
  const [list, setList] = useState(data);

  useEffect(()=>{

    let url="http://127.0.0.1:3000/shoppingLists?id=6562e3ad90ecb309eae9067d"

    fetch(url).then((res)=>{
      if(res.status == 200){
       res.json().then((data)=>{
        //console.log("xxxx",data);
          setList(data.shoppingLists)
          if( data.shoppingLists.length ==0){
            setList(data)
          }else{
            setList(data.shoppingLists)
          }
        });
      }
    })

  },[])
  const delList = (id) => {

    let isDel = window.confirm("Are you sure you want to remove this shopping list?")
    if(isDel){
      let filterArr = list.filter((item) => item._id !== id);

          let url=`http://127.0.0.1:3000/shoppingLists/del?id=${id}`

    fetch(url).then((res)=>{
      if(res.status == 200){
        console.log(res);
      setList(filterArr);

      }
    })

      setList(filterArr);



    }

  };
  const archiveList = (id) => {
    let filterArr = list.map((item) => {
      console.log(item);
      if (item._id == id) {

        let url=`http://127.0.0.1:3000/shoppingLists/changeArchive?id=${id}&isDone=${!item.isDone}`

        fetch(url).then((res)=>{
          if(res.status == 200){
           res.json().then((data)=>{
            console.log("xxxx",data);
              // setList(data.shoppingLists)
              // if( data.shoppingLists.length ==0){
              //   setList(data)
              // }else{
              //   setList(data.shoppingLists)
              // }

                if(data.shoppingLists.modifiedCount == 1){
                  console.log(data);
                }

            });
          }
        })


        return {
          ...item,
          isDone: !item.isDone,
        };
      } else {
        return item;
      }
    });

    setList(filterArr);
  };

  const unArchiveList = (id) => {
    // alert("unArchiveList");
    archiveList(id)
  };

  // const createListOne = () => {
  //   alert(" createListOne");
  // };

  return (
    <>
      <h2>Shopping Lists</h2>
      <Card >
        <List
          bordered
          header={
            <div className="titleInRow">
                <h4>Shopping Lists</h4>
               <Link to="createList">
                  <Button> create new shopping list</Button> 
              </Link>
           
            </div>
          }
          dataSource={list.filter((item) => item.isDone)}
          renderItem={(item) => (
            <List.Item>
              <Link to="list">
                <div>{item.listName}</div>
              </Link>
              <Button
                onClick={() => {
                  delList(item._id);
                }}
              >
                delete
              </Button>
              <Button
                onClick={() => {
                  archiveList(item._id);
                }}
              >
                archive
              </Button>
              
            </List.Item>
          )}
        ></List>

        <List
          bordered
          className="ArchivedList"
          header={<div> Archived Shopping Lists</div>}
          dataSource={list.filter((item) => !item.isDone)}
          renderItem={(item) => (
            <List.Item>
              {/* {item.listName}  */}
              {!item.isDone ? <div>{item.listName}</div> : <div></div>}
              <Button onClick={ ()=>{ unArchiveList(item._id) } }>unarchive</Button>
            </List.Item>
          )}
        ></List>
      </Card>
    </>
  );
}

export default ShoppingLists;
