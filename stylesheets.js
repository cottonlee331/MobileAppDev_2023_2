import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    calendar: {
      
    },

    modalView:{
      backgroundColor: 'white',
      padding:15,
      paddingBottom:0,
      borderTopLeftRadius:20,
      borderTopRightRadius:20, 
      shadowColor: '#000',
      shadowOffset:{
        width:0,
        height: 2,
      },
      shadowOpacity:0.25,
      shadowRadius: 4,
      elevation: 5,
      height:800
    },

    centeredView:{
      flex: 1,
      alignContent:'center',
      justifyContent:'flex-end',
      textAlignVertical:"center",
      backgroundColor:"rgba(0,0,0,0.5)",
    },

    dropdown:{
      borderWidth:0,
      width: 100,
      shadowColor: '#000',
      shadowOffset:{
        width:0,
        height: 2,
      },
      shadowOpacity:0.25,
      shadowRadius: 4,
      elevation: 2
    },
    addplayschDropdown:{
      borderWidth:0,
      width: 200,
      shadowColor: '#000',
      shadowOffset:{
        width:0,
        height: 2,
      },
      shadowOpacity:0.25,
      shadowRadius: 4,
      elevation: 2
    },

    discDropdown:{
      marginRight:10,
      borderWidth:0,
      shadowColor: '#000',
      shadowOffset:{
        width:0,
        height: 2,
      },
      shadowOpacity:0.25,
      shadowRadius: 4,
      elevation: 2,
      width: 70
    },
    discContainer:{
        marginRight:10,
        borderWidth:0,
        width: 70,
      },
    titleInput:{
      width:310,
      fontSize: 25, 
      margin: 10,
      color: '#F875AA',
    },
    textInput:{
      width:225,
      fontSize: 16, 
      margin: 10,
      color: '#F875AA',
    },
    rowTitle:{
      margin:5,
      width:70,
      fontSize:18,
      color:'#F875AA'
    },
    textInputwButton:{
      width:200,
      fontSize: 16, 
      margin: 10,
      color: '#F875AA',
    },
    textInputView:{
      width:375,
      paddingVertical:5,
      borderTopWidth:1,
      borderColor:'#FFDFDF',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'flex-start', 
      textAlignVertical:'bottom'
    },
    textInputCastView:{
      width:350,
      paddingVertical:10,
      borderTopWidth:1,
      borderColor:'#FFDFDF',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'flex-start', 
      textAlignVertical:'bottom'
    },
    dropdownInputView:{
      width:375,
      paddingVertical:5,
      borderTopWidth:1,
      borderColor:'#FFDFDF',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'flex-start', 
      textAlignVertical:'bottom',
      zIndex:100
    },
    dropdownInputView2:{
      width:375,
      paddingVertical:5,
      borderTopWidth:1,
      borderColor:'#FFDFDF',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'flex-start', 
      textAlignVertical:'bottom',
      zIndex:99
    },
    addButton:{
      borderRadius:15,
      width:35,height:35,
      alignItems:"center",
      justifyContent:'center',
      textAlignVertical:'center',
      backgroundColor:'#F875AA'
    },
    closeButton:{
      borderRadius:15,
      width:35,height:35,
      alignItems:"center",
      justifyContent:'flex-start',
      textAlignVertical:'top',
      backgroundColor:'#F875AA'
    },
    deleteButton:{
      borderRadius:15,
      width:35,height:35,
      alignItems:"center",
      justifyContent:'center',
      backgroundColor:'#AEDEFC'
    },
    writeButton:{
      marginTop:30,
      borderRadius:20,
      width:95,height:40,
      alignItems:"center",
      justifyContent:'center',
      backgroundColor:'#F875AA'
    },
    textInputCast:{
      width:230,
      fontSize: 16, 
      margin: 10,
      color: '#F875AA',
    },
    cards:{
        marginVertical:10,
        padding:10,
        backgroundColor:'#FFF6F6',
        borderRadius:20, 
    }
})

export default styles;