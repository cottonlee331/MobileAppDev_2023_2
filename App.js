import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DropDownPicker from "react-native-dropdown-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Calendar } from "react-native-calendars";

import React from "react";
import { Alert, Modal, View, Text, TextInput, Image, TouchableOpacity, ScrollView} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

import styles from './stylesheets.js'

const Tab = createBottomTabNavigator();

export default function App(){
  return(
    <NavigationContainer>
      <Tab.Navigator>
      <Tab.Screen name="캘린더" component={HomeScreen} options={{headerShown: false, tabBarIcon:({color,size})=>(
        <Ionicons name='calendar' color={color} size={size}/>),
        tabBarActiveTintColor:'#F875AA', tabBarInactiveTintColor:'#FFDFDF'}}/>
      <Tab.Screen name="공연 목록" component={PlayListScreen} options={{headerShown: false, tabBarIcon:({color,size})=>(
        <Ionicons name='list' color={color} size={size}/>),
        tabBarActiveTintColor:'#F875AA', tabBarInactiveTintColor:'#FFDFDF'}}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}


// 홈화면 (캘린더 화면)
function HomeScreen({navigation}){
  const [refresh,setRefresh] = useState(0);
  const [func,setFunc] = useState(null);

  // 모달 데이터 전달용 상수
  const [selectedDay,setSelectedDay] = useState({"dateString": "2011-12-13", "day": 13, "month": 12, "timestamp": 1702425600000, "year": 2011});
  
  // 모달창 열기,닫기
  const [modalVisible,setModalVisible] = useState(false);
  

  // 모달 화면 셋팅
  function onPressModalDate(date){
    setSelectedDay(date);
    setModalVisible(true);
    console.log(date);
    setFunc('dateDetail');
  }

  function onPressModalAddPlay(){
    setModalVisible(true);
    setFunc('addPlay');
  }

  function onPressModalClose(){
    setModalVisible(false);
    setRefresh(refresh+1);
  }

  function addSchedule(){
    setFunc('addPlaySchedule');
  }

  // 일정 삭제
  function removeSchedule(){
    Alert.alert("일정 삭제", "정말로 삭제하시겠습니까?",[
      {text:'취소',style:'cancel'},
      {text:'삭제',style:'destructive',
      onPress:async()=>{await removeScheduleFile()}}
    ])
  }

  async function removeScheduleFile(){
    await AsyncStorage.removeItem(selectedDay.dateString);
    setRefresh(refresh+1);
    Alert.alert("","삭제되었습니다.",[{text:'확인',style:'default'}]);
    onPressModalClose();
  }

  // 홈화면 리턴
  return(
    <View style = {{backgroundColor:'white',marginTop:30, flex:1, position:'relative'}}>
      <ScrollView style={{flex:1}}>
        <Calendar 
        style = {{backgroundColor:'white', borderBottomWidth:1, borderColor:'#FFDFDF'}}
        theme={{
          arrowColor:'salmon',
          weekVerticalMargin:0,
          // 헤더 요일 string 색상 변경
          'stylesheet.calendar.header':{
            dayTextAtIndex0:{color:'#F875AA'},
            dayTextAtIndex1:{color:'gray'},
            dayTextAtIndex2:{color:'gray'},
            dayTextAtIndex3:{color:'gray'},
            dayTextAtIndex4:{color:'gray'},
            dayTextAtIndex5:{color:'gray'},
            dayTextAtIndex6:{color:'#AEDEFC'}
          },
        }}
        enableSwipeMonths={true}
        onMonthChange={function(){setRefresh(refresh+1)}}
        // 캘린더 날짜 커스텀
        dayComponent={({date,state})=>{
          return(
              <View style = {{width:58, height:100, flexDirection:'column', borderTopWidth:1, borderColor:'#FFDFDF',backgroundColor:state==="today"?'#F875AA':'white',borderTopLeftRadius:state==='today'?10:0}}>
                <TouchableOpacity onPress={function(){state==='disabled'?onPressModalClose:onPressModalDate(date)}}>
                  <Text style = {{marginVertical:2,width:17,fontSize:12,textAlign:'center',color:state==='today'?'white':new Date(date.timestamp).getDay()===0?'#F875AA':new Date(date.timestamp).getDay()===6?'#AEDEFC':state==='disabled'?'lightgray':'gray'}}>
                      {date.day}
                  </Text>
                  <CalendarDaily today = {date} state = {state}/>
                </TouchableOpacity>
              </View>
          )
        }}
        />
      </ScrollView>
      <View style={{position:'absolute',right:10, bottom:30}}>
        <TouchableOpacity onPress={onPressModalAddPlay}>
          <View style={{width:50, height:50, borderRadius:30, backgroundColor:'#F875AA', alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:30, color:'white'}}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
      

      <View style={{flex:0}}>
        <Modal
        // 모달창
          animationType="slide"
          visible={modalVisible}
          transparent = {true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                <TouchableOpacity style={styles.closeButton} onPress={onPressModalClose}>
                  <Text style={{marginBottom:10,fontSize:20,color:'white'}}>x</Text>
                </TouchableOpacity>
              </View>
              <HomeModal func={func} selectedDay={selectedDay}/>
              <View style={{height:func==='dateDetail'?50:0,flexDirection:'row',justifyContent:'flex-end'}}>
                <TouchableOpacity onPress={addSchedule}>
                  <View style={styles.addButton}>
                    <Text style={{fontSize:20, color:'white'}}>+</Text>
                  </View>
                </TouchableOpacity>
                <View style={{width:10}}/>
                <TouchableOpacity onPress={removeSchedule}>
                  <View style={styles.deleteButton}>
                    <Ionicons name='trash' color={'white'}/>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
    );
}

// 공연 목록
function PlayListScreen(){
  const isFocused = useIsFocused();
  const [refresh,setRefresh] = useState(0);
  const [refresh2,setRefresh2] = useState(0);
  const [titles,setTitles] = useState('string');
  const [details,setDetails] = useState('string');
  var playDetails = {details:[]};

  // 파일 읽기
  async function getPlayTitles(){
    console.log('function start');
    var playTitles = await AsyncStorage.getItem('PlayTitles');
    playTitles = JSON.parse(playTitles);

    for (var i =0; i<playTitles.titles.length;i++){
      var tmp = await AsyncStorage.getItem(playTitles.titles[i]);
      tmp = JSON.parse(tmp);
      playDetails.details.push(tmp);
    }
    setTitles(playTitles);
    setDetails(playDetails);
    setRefresh(refresh+1);
  }

  // 삭제나 화면 이동시 call
  useEffect(function (){
    getPlayTitles();
  },[refresh2, isFocused]);

  // 작품 카드 스크롤뷰
  function PlayCardsView(props){
    const [compList,setCompList]=useState([]);
  
    function PlayCards(props){
    
      var detail = props.detail;
      
      // 공연 삭제
      function removePlay(){
        Alert.alert("공연 삭제", "정말로 삭제하시겠습니까?",[
          {text:'취소',style:'cancel'},
          {text:'삭제',style:'destructive',
          onPress:async()=>{await removePlayFile()}}
        ])
      }
    
      async function removePlayFile(){
        var playTitles = await AsyncStorage.getItem('PlayTitles');
        playTitles = JSON.parse(playTitles).titles;
        console.log(playTitles);
        var index = playTitles.indexOf(props.title);
        console.log(index);
        if(index>=0){
          playTitles.splice(index,1);
        }
        console.log(playTitles);
        // 타이틀 파일 수정, 공연정보 파일 삭제
        await AsyncStorage.setItem('PlayTitles',JSON.stringify({titles:playTitles}));
        await AsyncStorage.removeItem(props.title);
        setRefresh2(refresh2+1);    
      }
    
      return(
        <View style ={{marginHorizontal:10, alignItems:'center', justifyContent:'center'}}>
        <View style={styles.cards}>
          <View style={{width:370, height:220, flexDirection:'row',alignItems:'center'}}>
            <Image style={{width:150,height:200, margin:10}}  source={{uri:detail.image[0]}}/>
            <View>
              <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                <TouchableOpacity onPress={removePlay}>
                  <View style={styles.deleteButton}>
                    <Ionicons name='trash' color={'white'}/>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{height:40}}/>
              <Text style={{fontSize:20, color:'#F875AA', borderBottomWidth:1, borderColor:'#FFDFDF', width:200}}>{'<'} {detail.title} {'>'}</Text>
              <Text style={{fontSize:15}}> </Text>
              <Text style={{fontSize:15, color:'#F875AA'}}>{detail.place}</Text>
              <Text style={{fontSize:15, color:'#F875AA'}}>공연 시간: {detail.runningTime}분</Text>
            </View>
          </View>
        </View>
        </View>
      );
    }
    
    // 삭제하고 수정하려니 변수명이 꼬여서 추후 삭제... 
    function Redraw(){
      var compList=[];
      var a;
      if(props.titles==='string'||props.details==='string'){
        return;
      }
      var intitles = props.titles.titles;
      var indetails = props.details.details;
      for(var i = 0; i<intitles.length; i++){
        a = <PlayCards title={intitles[i]} detail={indetails[i]}/>
        compList.push(a);
      }
      setCompList(compList);
    }
  
    useEffect(function(){
      Redraw();
    },[refresh2]);
    return(<View>{compList}</View>);
  }
  

  return(
    <View style={{backgroundColor:'white',marginTop:30}}>
      <ScrollView>
        <PlayCardsView titles={titles} details={details}/>
      </ScrollView>
    </View>
  )
}

// 공연 추가
var ImageList = [];
var CharacList = [];
var TicketCostList = [];
var DiscountList = [];
function AddPlayScreen(){
  const [title,setTitle] = useState(null);
  const [place,setPlace] = useState(null);
  const [imageuri,setImageuri] = useState(null);
  const [charac,setCharac] = useState(null);
  const [seat,setSeat] = useState(null);
  const [cost,setCost] = useState(null);
  const [discName,setDiscName] = useState(null);
  const [discNum, setDiscNum] = useState(null);
  const [runningTime,setRunningTime] = useState(null);
  const [refresh,setRefresh] = useState(0);

  // 드롭다운 상수
  const [dopen, setdOpen] = useState(false);
  const [dvalue, setdValue] = useState('percentage');
  const [ditems,setdItems] = useState([
    {label:'%', value: 'percentage'},
    {label:'원', value: 'won'},
  ])

  // 이미지 리스트 추가함수
  function addImage(){
    if(imageuri===null){
      return;
    }
    console.log('addImage call: ');
    ImageList.push(imageuri);
    console.log('push image');
    console.log({ImageList});
    setRefresh(refresh+1);
    setImageuri(null);
  }
  
  // 배역 추가 함수
  function addCharacter(){
    if(charac===null){
      return;
    }
    CharacList.push({charac:charac,cast:[]});
    setRefresh(refresh+1);
    setCharac(null);
    console.log(CharacList);
  }

  // 좌석가격 추가 함수
  function addSeat(){
    if(seat===null || cost===null){
      return;
    }
    TicketCostList.push({seat:seat, cost:cost});
    setRefresh(refresh+1);
    setSeat(null);
    setCost(null);
  }

  // 할인권종 추가 함수 
  function addDiscount(){
    if(discName===null || discNum === null){
      return;
    }
    var tmpNum;
    if(dvalue==='percentage'){
      tmpNum = 0;
    }
    else{
      tmpNum = 1;
    }
    DiscountList.push({name:discName, num:discNum, type:ditems[tmpNum]});
    setRefresh(refresh+1);
    setDiscName('');
    setDiscNum(0);
    setdValue('percentage');
    console.log(DiscountList);
  }

  // 공연 파일 추가 함수
  async function writePlayDetail(){
    var playString ={title:title, place:place, image:ImageList, runningTime:runningTime, cost:TicketCostList, discount:DiscountList, character:CharacList};
    
    // 공연 제목 파일에 공연 추가
    var playTitles = await AsyncStorage.getItem('PlayTitles');
    if(playTitles!==null){
      playTitles = JSON.parse(playTitles);
    }
    else{
      playTitles = {"titles":[]};
    }
    playTitles.titles.push(playString.title);
    console.log(playTitles);
    await AsyncStorage.setItem('PlayTitles',JSON.stringify(playTitles));

    // 공연 정보 파일 생성
    const stringValue = JSON.stringify(playString);
    console.log(stringValue);
    await AsyncStorage.setItem(playString.title,stringValue);

    clearScreen();
  }

  // 화면 초기화
  function clearScreen(){
    ImageList.splice(0,ImageList.length);
    DiscountList.splice(0,DiscountList.length);
    TicketCostList.splice(0,TicketCostList.length);
    CharacList.splice(0,CharacList.length);

    setTitle(null);
    setImageuri(null);
    
    setPlace(null);
    setRunningTime(null);
    setSeat(null);
    setCost(null);
    
    setDiscName(null);
    setDiscNum(null);
    setdValue('percentage');
    
    setCharac(null);
    
    playTitles = null;
    console.log(DiscountList);
  }

  
  return(
    <ScrollView style={{flex:1}}>
      <View style={{alignItems:'center'}}>
      <CompListVis/>  
      <View style={{width:370, flex:1, alignItems:'flex-start',justifyContent:'flex-start' }}>
        <View style={{alignItems:'flex-start',justifyContent:"flex-start"}}>

          <View style={styles.textInputView}>
            <TextInput style={styles.titleInput} placeholder={'공연 제목'} placeholderTextColor='#FFDFDF'
              onChangeText={setTitle} value={title}/>
          </View>
          
          <View style={styles.textInputView}>
            <Text style={styles.rowTitle}>포스터</Text>
            <View style={{width:250}}>
            <TextInput style={styles.textInputwButton} placeholder={'이미지를 url 형태로 추가'} placeholderTextColor='#FFDFDF'
              onChangeText={setImageuri} value={imageuri}/>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addImage}>
              <Text style={{color:'white'}}>+</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.textInputView}>
            <Text style={styles.rowTitle}>공연장</Text>
            <TextInput style={styles.textInput} placeholder={'공연장'} placeholderTextColor='#FFDFDF'
              onChangeText={setPlace} value={place}/>
          </View>

          <View style={styles.textInputView}>
            <Text style={styles.rowTitle}>공연시간</Text>
            <TextInput style={{ width:70, fontSize: 16, margin: 10,color: '#F875AA'}} placeholder={'공연시간'} placeholderTextColor='#FFDFDF'
              keyboardType='number-pad' onChangeText={setRunningTime} value={runningTime}/>
            <Text style={{fontSize:18,color:'#F875AA'}}>분</Text>
            <View style={{width:145}}/>
          </View>

          <View style={styles.textInputView}>
            <Text style={styles.rowTitle}>티켓가격</Text>
            <View style={{width:250, flexDirection:'row', alignItems:'center',textAlignVertical:'bottom'}}>
            <TextInput style={{width:50, fontSize: 16, margin: 10,color: '#F875AA'}} 
              placeholder="등급" placeholderTextColor='#FFDFDF'
              onChangeText={setSeat} value={seat}/>
            <Text style={{fontSize:18,color:'#F875AA'}}>석  </Text>
            <TextInput style={{width:80, fontSize: 16, margin: 10,color: '#F875AA'}} 
              placeholder="티켓 가격" placeholderTextColor='#FFDFDF' keyboardType='number-pad'
              onChangeText={setCost} value={cost}/>
            <Text style={{fontSize:18,color:'#F875AA'}}>원</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addSeat}>
              <Text style={{color:'white'}}>+</Text>
            </TouchableOpacity>
          </View>
          <AddTicketCost/>

          <View style={styles.textInputView}>
            <Text style={styles.rowTitle}>할인권종</Text>
            <View style={{width:250, flexDirection:'row', alignItems:'center',textAlignVertical:'bottom'}}>
            <TextInput style={{width:50, fontSize: 16, margin: 10,color: '#F875AA'}} 
              placeholder="권종" placeholderTextColor='#FFDFDF'
              onChangeText={setDiscName} value={discName}/>
            <TextInput style={{width:50, fontSize: 16, margin: 10,color: '#F875AA'}} 
              placeholder="할인률" placeholderTextColor='#FFDFDF' keyboardType='number-pad'
              onChangeText={setDiscNum} value={discNum}/>
            <DropDownPicker
              style={styles.discDropdown}
              containerStyle={styles.discContainer}
              dropDownContainerStyle={{borderWidth:0, shadowColor: '#000',shadowOffset:{width:0,height: 2,},shadowOpacity:0.25,shadowRadius: 4,elevation: 1,}}
              listItemLabelStyle={{color:'#F875AA'}}
              labelStyle={{color:'#F875AA'}}
              open = {dopen}
              value = {dvalue}
              items = {ditems}
              setOpen={setdOpen}
              setValue={setdValue}
              setItems={setdItems}
            />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addDiscount}>
              <Text style={{color:'white'}}>+</Text>
            </TouchableOpacity>
          </View>
          <AddDiscount/>

          <View style={styles.textInputView}>
            <Text style={styles.rowTitle}>배역명</Text>
            <View style={{width:250}}>
            <TextInput style={styles.textInputwButton} placeholder={'배역명'} placeholderTextColor='#FFDFDF'
              onChangeText={setCharac} value={charac}/>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addCharacter}>
              <Text style={{color:'white'}}>+</Text>
            </TouchableOpacity>
          </View>
          <AddCharacter/>
        </View>
      </View>
      <TouchableOpacity style={styles.writeButton} onPress={writePlayDetail}>
        <Text style={{color:'white'}}>추가하기</Text>
      </TouchableOpacity>
      <View style={{height:30}}/>
      </View>
    </ScrollView>
    
  )
}

// 캘린더 날짜에 들어가는 컴포넌트
function CalendarDaily(props){
  const[imageuri,setImageuri] = useState(null);

  async function getDailyImage(){
    var dayData = await AsyncStorage.getItem(props.today.dateString);
    dayData = JSON.parse(dayData);
    setImageuri(dayData.image);
  }

  useEffect(function(){
    getDailyImage();
  },[]);

  return(
    <View>
      <Image style={{width:57, height:76, resizeMode:"contain",opacity: props.state === 'disabled' ? 0.1:1}} source={{uri:imageuri}}/>
    </View>
  );
}

// 홈화면 모달창 셋팅 함수
function HomeModal(props){
  if(props.func==='dateDetail'){
    return(
      <ScrollView>
        <View style={{alignItems:'center'}}>
          <DailySchedule selectedDay={props.selectedDay}/>
        </View>
      </ScrollView>
    );
  }

  else if(props.func==='addPlaySchedule'){
    return(
      <ScrollView>
        <AddPlaySchedule date={props.selectedDay}/>
      </ScrollView>
    );
  }

  else if(props.func==='addPlay'){
    return(<AddPlayScreen/>);
  }
}

// 일별 일정 상세화면
function DailySchedule(props){
  const [refresh,setRefresh] = useState(0);
  const [imageuri,setImageuri] = useState(null);
  const [hour,setHour] = useState(null);
  const [min, setMin] = useState(null);
  const [seat, setSeat] = useState(null);
  const [seatNum,setSeatNum] = useState(null);
  const [tCost,setTCost] = useState(null);
  const [title,setTitle] = useState(null);
  const [discount,setDiscount] = useState(null);
  var today = new Date(props.selectedDay.timestamp).getDay();
  var daystring;
  switch(today){
    case 0: 
      daystring = "일요일";
      break;
    case 1: 
      daystring = "월요일";
      break;
    case 2: 
      daystring = "화요일";
      break;
    case 3: 
      daystring = "수요일";
      break;
    case 4: 
      daystring = "목요일";
      break;
    case 5: 
      daystring = "금요일";
      break;
    case 6: 
      daystring = "토요일";
      break;
    default:
      daystring = "error";
      break;
  }

  async function getSchedule(){
    console.log("function call");
    var scheduleData = await AsyncStorage.getItem(props.selectedDay.dateString);
    scheduleData = JSON.parse(scheduleData);
    console.log(scheduleData);
    var playData = await AsyncStorage.getItem(scheduleData.title);
    playData = JSON.parse(playData);
    console.log(playData);
    for(var i = 0; i <playData.cost.length;i++){
      if(playData.cost[i].cost===scheduleData.seat){
        setSeat(playData.cost[i].seat);
        break;
      }

    }
    setImageuri(scheduleData.image);
    setHour(scheduleData.hour);
    setMin(scheduleData.minuete);
    setTCost(scheduleData.ticketCost);
    setTitle(scheduleData.title);
    setDiscount(scheduleData.discount);
    setSeatNum(scheduleData.seatNum);
    
    setRefresh(refresh+1);
  }

  useEffect(function(){
    console.log('useEffect');
    getSchedule();
  },[])

  // 해당날짜 일정 없음
  if(title===null){
    return<Text style={{fontSize:20, color:'#F875AA'}}>'+' 버튼을 눌러 관람 일정 추가.{'\n'}</Text>
  }

  // 해당날짜 일정 있음
  return(
    <View style ={{alignItems:'center', marginBottom:10}}>
      <Image style={{marginBottom:20, width:300, height: 400, resizeMode:"contain"}} source={{uri:imageuri}}/>
      <View style={styles.textInputView}>
        <Text style={{fontSize:30, color:'#F875AA'}}>{'< '}{title}{' >'}</Text>
      </View>
      <View style={styles.textInputView}>
        <Text style={styles.rowTitle}>일시</Text>
        <Text style={{fontSize:18,color:'#F875AA'}}>{props.selectedDay.month}월 {props.selectedDay.day}일  {daystring}  {hour}:{min}</Text>
      </View>
      <View style={styles.textInputView}>
        <Text style={styles.rowTitle}>좌석</Text>
        <Text style={{fontSize:18,color:'#F875AA'}}>{seatNum}  |  {seat}석   {discount}</Text>
      </View>
      <View style={styles.textInputView}>
        <Text style={styles.rowTitle}>티켓가격</Text>
        <Text style={{fontSize:18,color:'#F875AA'}}>{tCost}원</Text>
      </View>
    </View>
  )
}

// 관람 일정 추가
function AddPlaySchedule(props){
  const [refresh,setRefresh] = useState(0);
  const [imageList,setImageList] = useState([]);
  const [imageuri,setImageuri] = useState(null);
  const [hr,setHr] = useState(null);
  const [min,setMin] = useState(null);
  const [tCost,setTCost] = useState(0);
  const [seatNum,setSeatNum] = useState(null);
  const [imgIDX,setimgIDX] = useState(0);
  var detail = {};
  // 드롭다운용 상수
  const [topen, settOpen] = useState(false);
  const [tvalue, settValue] = useState('tmp');
  const [titems,settItems] = useState([{label:"기본",value:"tmp"}]);

  // 드롭다운용 상수_좌석
  const [sopen, setsOpen] = useState(false);
  const [svalue, setsValue] = useState('tmp');
  const [sitems,setsItems] = useState([{label:"기본",value:"tmp"}]);

  // 드롭다운용 상수_할인
  const [dopen, setdOpen] = useState(false);
  const [dvalue, setdValue] = useState('tmp');
  const [ditems,setdItems] = useState([{label:"기본",value:"tmp"}]);
  const [discountNum,setDiscountNum] = useState([])
  
  // 제목 드롭다운 셋팅
  var tmpItems = [];
  async function addToDropdown(){
    console.log('add to dropdown');
    var titles = await AsyncStorage.getItem('PlayTitles');
    console.log(titles);
    titles = JSON.parse(titles);
    for(var i = 0; i<titles.titles.length;i++){
      tmpItems.push({label:titles.titles[i], value:titles.titles[i]});
    }
    settItems(tmpItems);
    setRefresh(refresh+1);
  }

  // 제목선택 후 좌석, 할인 드롭다운 셋팅
  async function getDetails(){
    if(tvalue==='tmp'){
      return;
    }
    detail = await AsyncStorage.getItem(tvalue);
    console.log(detail);
    detail = JSON.parse(detail);
    console.log(detail);
    setImageList(detail.image);
    setImageuri(detail.image[0]);
    console.log(detail.cost);
    var tmpsItems = []
    for(var i = 0; i<detail.cost.length;i++){
      tmpsItems.push({label:detail.cost[i].seat, value:detail.cost[i].cost});
    }
    setsItems(tmpsItems);
    setRefresh(refresh+1);
    var tmpdItems = []
    for(var i = 0; i<detail.discount.length;i++){
      tmpdItems.push({label:detail.discount[i].name, value:i});
      tmpItems.push(detail.discount[i].num);
    }
    console.log(discountNum);
    setDiscountNum(tmpItems);
    setdItems(tmpdItems);
    setdValue(ditems[0].value);
    setsValue(sitems[0].value);
    setRefresh(refresh+1);
  }

  // 할인권종, 좌석가격 사용하여 티켓가격 계산
  function ticketCost(){
    if(dvalue==='tmp'||svalue==='tmp'){
      return;
    }
    console.log('ticket cost call:',dvalue,',',svalue,'dscountNum:',discountNum);
    var tmp = discountNum[dvalue]>100?(svalue-discountNum[dvalue]):(svalue*(1-discountNum[dvalue]/100))
    console.log(discountNum[dvalue]);
    setTCost(tmp);
  }

  // 화면 초기화
  function clearScreen(){
    setImageList([]);
    setImageuri(null);
    setHr(null);
    setMin(null);
    setTCost(0);
    setimgIDX(0);
    settItems([{label:"기본",value:"tmp"}]);
    setsItems([{label:"기본",value:"tmp"}]);
    setdItems([{label:"기본",value:"tmp"}]);
    setDiscountNum([]);
    setSeatNum(null);
  }

  // 일정 파일 추가
  async function writeSchedule(){
    var playString ={title:tvalue,date:props.date.dateString, image:imageuri, hour:hr, minuete:min, seat:svalue, seatNum:seatNum, discount:ditems[dvalue].label, ticketCost:tCost};
    console.log('일정 추가:',playString)
    // 일정 정보 파일 생성
    const stringValue = JSON.stringify(playString);
    console.log(stringValue);
    await AsyncStorage.setItem(playString.date,stringValue);

    clearScreen();
    
    Alert.alert("","추가되었습니다.",[{text:'확인',style:'default'}]);
  }

  // 최초실행
  useEffect(function(){
    addToDropdown();
  },[]);

  // 제목 변동시 할인, 좌석정보 다시가져옴
  useEffect(function(){
    getDetails();
  },[tvalue]);

  // 할인, 좌석가격 변동 시 티켓가격 재계산
  useEffect(function(){
    ticketCost()
  },[dvalue,svalue]);

  return(
    <ScrollView>
      <View style={{height:800,alignItems:'center'}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <TouchableOpacity onPress={function() {setimgIDX((imgIDX-1+imageList.length)%imageList.length);console.log(imgIDX);setImageuri(imageList[imgIDX]);}}>
          <Text style={{fontSize:30, color:'#F875AA'}}>{'<'}</Text>
          </TouchableOpacity>
          <Image style={{backgroundColor:'#FFF6F6',margin:20, width:300, height: 400, resizeMode:"contain"}} source={{uri:imageuri}}/>
          <TouchableOpacity onPress={function() {setimgIDX((imgIDX+1)%imageList.length);console.log(imgIDX);setImageuri(imageList[imgIDX]);}}>
            <Text style={{fontSize:30, color:'#F875AA'}}>{'>'}</Text>
          </TouchableOpacity>
        </View>

      <View style={{alignItems:'flex-start'}}>
      <View style={styles.dropdownInputView}>
        <Text style={styles.rowTitle}>제목</Text>
        <DropDownPicker
          style={styles.addplayschDropdown}
          containerStyle={styles.addplayschDropdown}
          dropDownContainerStyle={{borderWidth:0,shadowColor: '#000',shadowOffset:{width:2,height: 0,},
          shadowOpacity:0.25,
          shadowRadius: 4,
          elevation: 2}}
          listItemLabelStyle={{color:'#F875AA'}}
          labelStyle={{color:'#F875AA'}}
          open = {topen}
          value = {tvalue}
          items = {titems}
          setOpen={settOpen}
          setValue={settValue}
          setItems={settItems}
        />
      </View>

      <View style={styles.textInputView}>
        <Text style={styles.rowTitle}>일시</Text>
        <Text style={{fontSize:18, color:'#F875AA'}}>{props.date.dateString}</Text>
        <TextInput style={{textAlign:'center',width:30,fontSize: 16, margin: 10,color: '#F875AA'}} 
              placeholder="시" placeholderTextColor='#FFDFDF' keyboardType='number-pad'
              onChangeText={setHr} value={hr}/>
        <Text style={{fontSize:18, color:'#F875AA'}}> : </Text>
        <TextInput style={{textAlign:'center',width:30,fontSize: 16, margin: 10,color: '#F875AA'}} 
              placeholder="분" placeholderTextColor='#FFDFDF' keyboardType='number-pad'
              onChangeText={setMin} value={min}/>
      </View>

      <View style={styles.textInputView}>
        <Text style={styles.rowTitle}>티켓가격</Text>
        <Text style={{fontSize:18, color:'#F875AA'}}>{tCost} 원</Text>
      </View>

      <View style={styles.dropdownInputView2}>
        <DropDownPicker
          style={styles.dropdown}
          containerStyle={styles.dropdown}
          dropDownContainerStyle={{borderWidth:0,shadowColor: '#000',shadowOffset:{width:2,height: 0,},
          shadowOpacity:0.25,
          shadowRadius: 4,
          elevation: 2}}
          listItemLabelStyle={{color:'#F875AA'}}
          labelStyle={{color:'#F875AA'}}
          open = {sopen}
          value = {svalue}
          items = {sitems}
          setOpen={setsOpen}
          setValue={setsValue}
          setItems={setsItems}
        />
        <Text style={{fontSize:18, color:'#F875AA'}}>석  </Text>
        <DropDownPicker
          style={styles.addplayschDropdown}
          containerStyle={styles.addplayschDropdown}
          dropDownContainerStyle={{borderWidth:0,shadowColor: '#000',shadowOffset:{width:2,height: 0,},
          shadowOpacity:0.25,
          shadowRadius: 4,
          elevation: 2}}
          listItemLabelStyle={{color:'#F875AA'}}
          labelStyle={{color:'#F875AA'}}
          open = {dopen}
          value = {dvalue}
          items = {ditems}
          setOpen={setdOpen}
          setValue={setdValue}
          setItems={setdItems}
        />
      </View>

      <View style={styles.textInputView}>
            <Text style={styles.rowTitle}>좌석번호</Text>
            <TextInput style={{ width:70, fontSize: 16, margin: 10,color: '#F875AA'}} placeholder={'좌석번호'} placeholderTextColor='#FFDFDF'
              onChangeText={setSeatNum} value={seatNum}/>
            <View style={{width:145}}/>
      </View>

      </View>
      <TouchableOpacity style={styles.writeButton} onPress={writeSchedule}>
        <Text style={{color:'white'}}>추가하기</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );

}

// 공연 추가 화면 포스터 횡스크롤뷰
function CompListVis(){
  if(ImageList.length===0){
    return(
      <View style={{width:300, height:400, margin:10, backgroundColor:'#FFDFDF'}}/>
    );
  }
  var compList=[];
  var a;
  for(var i = 0; i<ImageList.length;i++){
    a = <Image key={i} style={{width:300, height:400, margin:10}} source={{uri:ImageList[i]}}/>
    compList.push(a);
  }

  return(
    <ScrollView horizontal={true}>
      {compList}
    </ScrollView>
  );
}

// 배역 추가 함수
function AddCharacter(){
  var compList=[];
  var a;

  for(var i = 0; i<CharacList.length; i++){
    a = <AddCast n={i}/>;
    compList.push(a);
  }
  return(
    <ScrollView>
      {compList}
    </ScrollView>
  );
}

// 캐스트 추가 함수
function AddCast(props){
  const [cast,setCast]=useState(null);
  const [refresh,setRefresh] = useState(0);

  var compList=[];
  var a;

  function addCast(){
    if(cast===null){
      return;
    }
    CharacList[props.n].cast.push(cast);
    setRefresh(refresh+1);
    setCast(null);
  }
  for(var i = 0; i<CharacList[props.n].cast.length;i++){
    a = <Text style={{fontSize:12, color:'#F875AA'}}> {CharacList[props.n].cast[i]} </Text>
    compList.push(a);
  }
  return(
    <View style={styles.cards}>
      <Text style={{fontSize:18, color:'#F875AA', marginBottom:5}}>{'\<'} {CharacList[props.n].charac} {'\>'}</Text>
      <View style={styles.textInputCastView}>
        <Text style={{fontSize:18, color:'#F875AA'}}>캐스트: </Text>
        <TextInput style={styles.textInputCast} placeholder={'캐스트'} placeholderTextColor='#FFDFDF'
          onChangeText={setCast} value={cast}/>
        <TouchableOpacity style={styles.addButton} onPress={addCast}>
          <Text style={{color:'white'}}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{width:320}} horizontal={true}>
      {compList}
      </ScrollView>
    </View>
  );
}

// 티켓가격 추가 함수
function AddTicketCost(){
  var compList=[];
  var a;

  for(var i = 0; i<TicketCostList.length; i++){
    a = <Text sytle={{fontSize:12, color:'#F875AA'}}>*  {TicketCostList[i].seat} 석{'\t\t'}{TicketCostList[i].cost} 원</Text>;
    compList.push(a);
  }
  return(
    <View>
      {compList}
    </View>
  );
}

// 할인권종 추가 함수
function AddDiscount(){
  var compList=[];
  var a;

  for(var i = 0; i<DiscountList.length; i++){
    a = <Text sytle={{fontSize:12, color:'#F875AA'}}>*  {DiscountList[i].name}{'\t\t'}{DiscountList[i].num} {DiscountList[i].type.label}</Text>;
    compList.push(a);
  }
  return(
    <View>
      {compList}
    </View>
  );
}

