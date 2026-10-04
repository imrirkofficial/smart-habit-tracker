import React, {
    useEffect,
    useRef,
    useState
} from "react";


import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert
} from "react-native";


import api from "../api/api";


import i18n
from "../localization/i18n";





export default function AICoachScreen(){


    const [message,setMessage] =
        useState("");


    const [messages,setMessages] =
        useState([]);


    const [loading,setLoading] =
        useState(false);


    const [initialLoading,setInitialLoading] =
        useState(true);


    const listRef =
        useRef(null);





    /*
    |--------------------------------------------------------------------------
    | Language Helpers
    |--------------------------------------------------------------------------
    */


    const isBangla =
        String(
            i18n.locale || ""
        )
        .toLowerCase()
        .startsWith("bn");



    const text = {

        greeting:isBangla
            ? "হ্যালো! আমি আপনার AI Habit Coach 🤖 আপনার habit progress দেখে আমি আপনাকে আরও consistent হতে সাহায্য করতে পারি।"
            : "Hello! I am your AI Habit Coach 🤖 I can use your habit progress to help you become more consistent.",


        placeholder:isBangla
            ? "AI Coach-কে কিছু জিজ্ঞাসা করুন..."
            : "Ask your AI Coach...",


        thinking:isBangla
            ? "ভাবছি..."
            : "Thinking...",


        errorTitle:isBangla
            ? "AI Coach সমস্যা"
            : "AI Coach Error",


        errorMessage:isBangla
            ? "AI Coach এখন response দিতে পারছে না। একটু পরে আবার চেষ্টা করুন।"
            : "AI Coach cannot respond right now. Please try again shortly.",


        initialFallback:isBangla
            ? "আপনার habit tracking চালিয়ে যান। কিছু data তৈরি হলে আমি আপনার progress দেখে personalized suggestion দিতে পারব। 🌱"
            : "Keep tracking your habits. As your data grows, I can give you more personalized suggestions. 🌱"

    };





    /*
    |--------------------------------------------------------------------------
    | Initial AI Insight
    |--------------------------------------------------------------------------
    */


    useEffect(()=>{


        loadInitialInsight();


    },[]);





    const loadInitialInsight =
        async()=>{


            try{


                const response =
                    await api.get(
                        "/ai-insights"
                    );


                const insight =
                    response?.data?.insight;


                setMessages([

                    {
                        id:
                            `ai-${Date.now()}`,

                        sender:"ai",

                        text:
                            insight
                            || text.greeting
                    }

                ]);


            }

            catch(error){


                console.log(
                    "INITIAL AI INSIGHT ERROR:",
                    error?.response?.data
                    || error?.message
                    || error
                );


                setMessages([

                    {
                        id:
                            `ai-${Date.now()}`,

                        sender:"ai",

                        text:
                            text.initialFallback
                    }

                ]);


            }

            finally{


                setInitialLoading(false);


            }


        };





    /*
    |--------------------------------------------------------------------------
    | Send Message
    |--------------------------------------------------------------------------
    */


    const sendMessage =
        async()=>{


            const cleanMessage =
                message.trim();


            if(
                !cleanMessage
                || loading
            ){
                return;
            }



            /*
            Current history BEFORE
            adding this new user message.
            */

            const history =
                messages
                    .slice(-10)
                    .map(
                        item=>({

                            sender:
                                item.sender,

                            text:
                                item.text

                        })
                    );



            const userMessage = {

                id:
                    `user-${Date.now()}`,

                sender:"user",

                text:
                    cleanMessage

            };



            setMessages(
                previous=>[
                    ...previous,
                    userMessage
                ]
            );


            setMessage("");


            setLoading(true);



            try{


                const response =
                    await api.post(
                        "/ai/chat",
                        {

                            message:
                                cleanMessage,

                            language:
                                isBangla
                                    ? "bn"
                                    : "en",

                            history:
                                history

                        }
                    );



                const reply =
                    response?.data?.reply;



                if(!reply){

                    throw new Error(
                        "Empty AI response"
                    );

                }



                const aiMessage = {

                    id:
                        `ai-${Date.now()}`,

                    sender:"ai",

                    text:
                        reply

                };



                setMessages(
                    previous=>[
                        ...previous,
                        aiMessage
                    ]
                );


            }

            catch(error){


                console.log(
                    "AI CHAT ERROR:",
                    error?.response?.data
                    || error?.message
                    || error
                );



                const backendMessage =
                    error?.response
                        ?.data
                        ?.message;



                const errorText =
                    backendMessage
                    || text.errorMessage;



                setMessages(
                    previous=>[
                        ...previous,

                        {
                            id:
                                `error-${Date.now()}`,

                            sender:"ai",

                            text:
                                errorText,

                            error:true
                        }

                    ]
                );



                Alert.alert(

                    text.errorTitle,

                    errorText

                );


            }

            finally{


                setLoading(false);


            }


        };





    /*
    |--------------------------------------------------------------------------
    | Render Message
    |--------------------------------------------------------------------------
    */


    const renderMessage =
        ({item})=>{


            const isUser =
                item.sender === "user";


            return(


                <View

                    style={[

                        styles.messageBubble,

                        isUser
                            ? styles.userBubble
                            : styles.aiBubble,

                        item.error
                            ? styles.errorBubble
                            : null

                    ]}

                >


                    {

                        !isUser &&

                        <Text
                            style={styles.aiLabel}
                        >

                            🤖 AI Coach

                        </Text>

                    }


                    <Text

                        style={[

                            styles.messageText,

                            isUser
                                ? styles.userText
                                : styles.aiText

                        ]}

                    >

                        {item.text}

                    </Text>


                </View>


            );


        };





    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */


    if(initialLoading){


        return(


            <View
                style={styles.center}
            >


                <ActivityIndicator

                    size="large"

                    color="#16A34A"

                />


                <Text
                    style={styles.loadingText}
                >

                    {text.thinking}

                </Text>


            </View>


        );


    }





    /*
    |--------------------------------------------------------------------------
    | Main UI
    |--------------------------------------------------------------------------
    */


    return(


        <KeyboardAvoidingView

            style={styles.container}

            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }

            keyboardVerticalOffset={
                Platform.OS === "ios"
                    ? 70
                    : 0
            }

        >



            <View
                style={styles.header}
            >


                <View>


                    <Text
                        style={styles.title}
                    >

                        🤖 {i18n.t("ai_coach")}

                    </Text>


                    <Text
                        style={styles.subtitle}
                    >

                        {
                            isBangla
                                ? "আপনার personalized habit assistant"
                                : "Your personalized habit assistant"
                        }

                    </Text>


                </View>


                <View
                    style={styles.onlineBadge}
                >


                    <View
                        style={styles.onlineDot}
                    />


                    <Text
                        style={styles.onlineText}
                    >

                        AI

                    </Text>


                </View>


            </View>





            <FlatList

                ref={listRef}

                data={messages}

                keyExtractor={
                    item=>item.id
                }

                renderItem={
                    renderMessage
                }

                contentContainerStyle={
                    styles.chatContent
                }

                showsVerticalScrollIndicator={
                    false
                }

                keyboardShouldPersistTaps={
                    "handled"
                }

                onContentSizeChange={()=>{

                    listRef.current
                        ?.scrollToEnd({
                            animated:true
                        });

                }}

            />





            {

                loading && (


                    <View
                        style={styles.typingContainer}
                    >


                        <ActivityIndicator

                            size="small"

                            color="#16A34A"

                        />


                        <Text
                            style={styles.typingText}
                        >

                            🤖 {text.thinking}

                        </Text>


                    </View>


                )

            }





            <View
                style={styles.inputContainer}
            >


                <TextInput

                    style={styles.input}

                    value={message}

                    onChangeText={
                        setMessage
                    }

                    placeholder={
                        text.placeholder
                    }

                    placeholderTextColor={
                        "#94A3B8"
                    }

                    multiline

                    maxLength={1500}

                    editable={!loading}

                    returnKeyType="send"

                    blurOnSubmit={false}

                    onSubmitEditing={()=>{

                        if(
                            Platform.OS !== "ios"
                        ){

                            sendMessage();

                        }

                    }}

                />





                <TouchableOpacity

                    style={[

                        styles.sendButton,

                        (
                            !message.trim()
                            || loading
                        )
                            ? styles.sendDisabled
                            : null

                    ]}

                    onPress={
                        sendMessage
                    }

                    disabled={
                        !message.trim()
                        || loading
                    }

                    activeOpacity={0.8}

                >


                    {

                        loading
                            ?

                        <ActivityIndicator

                            size="small"

                            color="#FFFFFF"

                        />

                            :

                        <Text
                            style={styles.sendText}
                        >

                            ➤

                        </Text>

                    }


                </TouchableOpacity>


            </View>



        </KeyboardAvoidingView>


    );


}





const styles =
StyleSheet.create({


    container:{

        flex:1,

        backgroundColor:
            "#F8FAFC"

    },


    center:{

        flex:1,

        justifyContent:
            "center",

        alignItems:
            "center",

        backgroundColor:
            "#F0FDF4"

    },


    loadingText:{

        marginTop:12,

        color:"#64748B",

        fontSize:14

    },


    header:{

        paddingTop:
            Platform.OS === "ios"
                ? 55
                : 38,

        paddingHorizontal:20,

        paddingBottom:16,

        backgroundColor:
            "#FFFFFF",

        flexDirection:"row",

        alignItems:"center",

        justifyContent:
            "space-between",

        borderBottomWidth:1,

        borderBottomColor:
            "#E2E8F0"

    },


    title:{

        fontSize:25,

        fontWeight:"800",

        color:"#14532D"

    },


    subtitle:{

        marginTop:4,

        fontSize:13,

        color:"#64748B"

    },


    onlineBadge:{

        flexDirection:"row",

        alignItems:"center",

        backgroundColor:
            "#DCFCE7",

        paddingHorizontal:10,

        paddingVertical:6,

        borderRadius:20

    },


    onlineDot:{

        width:7,

        height:7,

        borderRadius:4,

        backgroundColor:
            "#16A34A",

        marginRight:5

    },


    onlineText:{

        color:"#15803D",

        fontWeight:"700",

        fontSize:12

    },


    chatContent:{

        paddingHorizontal:16,

        paddingVertical:20,

        paddingBottom:25

    },


    messageBubble:{

        maxWidth:"84%",

        paddingHorizontal:15,

        paddingVertical:12,

        borderRadius:18,

        marginBottom:10

    },


    aiBubble:{

        alignSelf:
            "flex-start",

        backgroundColor:
            "#DCFCE7",

        borderBottomLeftRadius:6

    },


    userBubble:{

        alignSelf:
            "flex-end",

        backgroundColor:
            "#16A34A",

        borderBottomRightRadius:6

    },


    errorBubble:{

        backgroundColor:
            "#FEE2E2"

    },


    aiLabel:{

        fontSize:11,

        fontWeight:"700",

        color:"#15803D",

        marginBottom:5

    },


    messageText:{

        fontSize:15,

        lineHeight:22

    },


    aiText:{

        color:"#14532D"

    },


    userText:{

        color:"#FFFFFF"

    },


    typingContainer:{

        flexDirection:"row",

        alignItems:"center",

        marginHorizontal:18,

        marginBottom:8

    },


    typingText:{

        marginLeft:8,

        fontSize:13,

        color:"#64748B"

    },


    inputContainer:{

        flexDirection:"row",

        alignItems:"flex-end",

        paddingHorizontal:12,

        paddingVertical:10,

        backgroundColor:
            "#FFFFFF",

        borderTopWidth:1,

        borderTopColor:
            "#E2E8F0"

    },


    input:{

        flex:1,

        minHeight:46,

        maxHeight:120,

        backgroundColor:
            "#F1F5F9",

        borderRadius:22,

        paddingHorizontal:16,

        paddingTop:12,

        paddingBottom:12,

        color:"#0F172A",

        fontSize:15

    },


    sendButton:{

        width:46,

        height:46,

        marginLeft:8,

        borderRadius:23,

        backgroundColor:
            "#16A34A",

        justifyContent:
            "center",

        alignItems:
            "center"

    },


    sendDisabled:{

        opacity:0.45

    },


    sendText:{

        color:"#FFFFFF",

        fontSize:21,

        fontWeight:"bold",

        marginLeft:2

    }


});