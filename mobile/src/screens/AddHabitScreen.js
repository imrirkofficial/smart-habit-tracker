import React, {
    useState
} from "react";


import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Switch,
    ActivityIndicator,
    Platform
} from "react-native";


import api
from "../api/api";


import i18n
from "../localization/i18n";


import {
    scheduleHabitReminder
} from "../services/notificationService";





export default function AddHabitScreen({
    navigation
}){


    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */


    const [title,setTitle] =
        useState("");


    const [description,setDescription] =
        useState("");


    const [frequency,setFrequency] =
        useState("daily");


    const [target,setTarget] =
        useState("30");


    const [emoji,setEmoji] =
        useState("🌱");


    const [color,setColor] =
        useState("#16A34A");


    const [
        reminderEnabled,
        setReminderEnabled
    ] =
        useState(false);


    const [reminderHour,setReminderHour] =
        useState("20");


    const [
        reminderMinute,
        setReminderMinute
    ] =
        useState("00");


    const [loading,setLoading] =
        useState(false);





    /*
    |--------------------------------------------------------------------------
    | Language
    |--------------------------------------------------------------------------
    */


    const isBangla =
        String(
            i18n.locale
            || ""
        )
        .toLowerCase()
        .startsWith("bn");



    const words = {

        title:isBangla
            ? "নতুন অভ্যাস তৈরি করুন"
            : "Create New Habit",


        subtitle:isBangla
            ? "ছোট পদক্ষেপ থেকে বড় পরিবর্তন শুরু হয়"
            : "Small steps create big changes",


        habitName:isBangla
            ? "অভ্যাসের নাম"
            : "Habit Name",


        habitPlaceholder:isBangla
            ? "যেমন: বই পড়া"
            : "Example: Reading",


        description:isBangla
            ? "বর্ণনা"
            : "Description",


        descriptionPlaceholder:isBangla
            ? "আপনার habit সম্পর্কে লিখুন"
            : "Write something about this habit",


        chooseEmoji:isBangla
            ? "আইকন নির্বাচন করুন"
            : "Choose Icon",


        frequency:isBangla
            ? "ফ্রিকোয়েন্সি"
            : "Frequency",


        daily:isBangla
            ? "প্রতিদিন"
            : "Daily",


        weekly:isBangla
            ? "সাপ্তাহিক"
            : "Weekly",


        monthly:isBangla
            ? "মাসিক"
            : "Monthly",


        target:isBangla
            ? "টার্গেট"
            : "Target",


        minutes:isBangla
            ? "মিনিট"
            : "minutes",


        theme:isBangla
            ? "থিম কালার"
            : "Theme Color",


        reminder:isBangla
            ? "রিমাইন্ডার"
            : "Reminder",


        reminderDescription:isBangla
            ? "Habit করার সময় notification পান"
            : "Get notified when it's time for your habit",


        reminderTime:isBangla
            ? "রিমাইন্ডার সময়"
            : "Reminder Time",


        create:isBangla
            ? "অভ্যাস তৈরি করুন"
            : "Create Habit",


        success:isBangla
            ? "সফল"
            : "Success",


        created:isBangla
            ? "অভ্যাস সফলভাবে তৈরি হয়েছে।"
            : "Habit created successfully.",


        validation:isBangla
            ? "তথ্য যাচাই করুন"
            : "Check Your Information",


        titleRequired:isBangla
            ? "Habit name লিখুন।"
            : "Please enter a habit name.",


        targetInvalid:isBangla
            ? "Target একটি সঠিক সংখ্যা হতে হবে।"
            : "Target must be a valid number.",


        reminderInvalid:isBangla
            ? "সঠিক reminder time দিন।"
            : "Please enter a valid reminder time.",


        error:isBangla
            ? "ত্রুটি"
            : "Error",


        createError:isBangla
            ? "Habit তৈরি করা যায়নি।"
            : "Could not create habit.",


        notificationNote:isBangla
            ? "Expo Go-তে notification skip হবে। Development build-এ reminder কাজ করবে।"
            : "Notifications are skipped in Expo Go. Reminders will work in a development/production build."

    };





    /*
    |--------------------------------------------------------------------------
    | Options
    |--------------------------------------------------------------------------
    */


    const emojis = [

        "🌱",

        "📚",

        "🏃",

        "💧",

        "🧘",

        "💪",

        "🥗",

        "😴",

        "💻",

        "✍️",

        "🎯",

        "🧠"

    ];



    const colors = [

        "#16A34A",

        "#2563EB",

        "#7C3AED",

        "#EA580C",

        "#DC2626",

        "#0891B2",

        "#CA8A04",

        "#DB2777"

    ];



    const frequencyOptions = [

        {
            key:"daily",
            label:words.daily
        },

        {
            key:"weekly",
            label:words.weekly
        },

        {
            key:"monthly",
            label:words.monthly
        }

    ];





    /*
    |--------------------------------------------------------------------------
    | Time Presets
    |--------------------------------------------------------------------------
    */


    const setTimePreset =
        (
            hour,
            minute
        )=>{


            setReminderHour(
                String(hour)
                    .padStart(
                        2,
                        "0"
                    )
            );


            setReminderMinute(
                String(minute)
                    .padStart(
                        2,
                        "0"
                    )
            );


        };





    /*
    |--------------------------------------------------------------------------
    | Validate
    |--------------------------------------------------------------------------
    */


    const validateForm =
        ()=>{


            if(
                !title.trim()
            ){

                Alert.alert(

                    words.validation,

                    words.titleRequired

                );


                return false;

            }



            const numericTarget =
                Number(
                    target
                );


            if(
                !Number.isInteger(
                    numericTarget
                )
                ||
                numericTarget < 1
                ||
                numericTarget > 1440
            ){

                Alert.alert(

                    words.validation,

                    words.targetInvalid

                );


                return false;

            }



            if(reminderEnabled){


                const hour =
                    Number(
                        reminderHour
                    );


                const minute =
                    Number(
                        reminderMinute
                    );


                if(
                    !Number.isInteger(
                        hour
                    )
                    ||
                    !Number.isInteger(
                        minute
                    )
                    ||
                    hour < 0
                    ||
                    hour > 23
                    ||
                    minute < 0
                    ||
                    minute > 59
                ){

                    Alert.alert(

                        words.validation,

                        words.reminderInvalid

                    );


                    return false;

                }

            }


            return true;

        };





    /*
    |--------------------------------------------------------------------------
    | Create Habit
    |--------------------------------------------------------------------------
    */


    const createHabit =
        async()=>{


            if(
                !validateForm()
            ){

                return;

            }


            if(loading){

                return;

            }


            setLoading(true);



            try{


                const hour =
                    reminderEnabled
                    ?
                    Number(
                        reminderHour
                    )
                    :
                    null;


                const minute =
                    reminderEnabled
                    ?
                    Number(
                        reminderMinute
                    )
                    :
                    null;



                const payload = {

                    title:
                        title.trim(),

                    description:
                        description.trim()
                        || null,

                    frequency:
                        frequency,

                    target:
                        Number(
                            target
                        ),

                    emoji:
                        emoji,

                    color:
                        color,

                    reminder_enabled:
                        reminderEnabled,

                    reminder_hour:
                        hour,

                    reminder_minute:
                        minute

                };



                /*
                |--------------------------------------------------------------------------
                | Backend Create
                |--------------------------------------------------------------------------
                */


                const response =
                    await api.post(

                        "/habits",

                        payload

                    );



                const habit =
                    response
                        ?.data
                        ?.habit
                    ||
                    response
                        ?.data;



                /*
                |--------------------------------------------------------------------------
                | Schedule Local Reminder
                |--------------------------------------------------------------------------
                */


                if(
                    reminderEnabled
                    &&
                    habit?.id
                ){


                    try{


                        await scheduleHabitReminder({

                            habitId:
                                habit.id,

                            title:
                                `${
                                    habit.emoji
                                    || emoji
                                } ${
                                    habit.title
                                    || title
                                }`,

                            hour:
                                hour,

                            minute:
                                minute

                        });


                    }

                    catch(
                        notificationError
                    ){


                        console.log(

                            "HABIT REMINDER ERROR:",

                            notificationError

                        );


                    }

                }



                /*
                |--------------------------------------------------------------------------
                | Success
                |--------------------------------------------------------------------------
                */


                Alert.alert(

                    words.success,

                    words.created,

                    [

                        {

                            text:"OK",

                            onPress:()=>{

                                navigation.goBack();

                            }

                        }

                    ]

                );


            }

            catch(error){


                console.log(

                    "CREATE HABIT ERROR:",

                    error?.response?.data
                    ||
                    error?.message
                    ||
                    error

                );



                const backendMessage =
                    error
                        ?.response
                        ?.data
                        ?.message;



                const validationErrors =
                    error
                        ?.response
                        ?.data
                        ?.errors;



                let message =
                    backendMessage
                    ||
                    words.createError;



                if(validationErrors){


                    const firstKey =
                        Object.keys(
                            validationErrors
                        )[0];


                    if(
                        firstKey
                        &&
                        validationErrors[
                            firstKey
                        ]?.[0]
                    ){

                        message =
                            validationErrors[
                                firstKey
                            ][0];

                    }

                }



                Alert.alert(

                    words.error,

                    message

                );


            }

            finally{


                setLoading(false);


            }


        };





    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */


    return(


        <ScrollView

            style={
                styles.container
            }

            contentContainerStyle={
                styles.content
            }

            keyboardShouldPersistTaps="handled"

            showsVerticalScrollIndicator={
                false
            }

        >



            {/* Header */}


            <View
                style={styles.header}
            >


                <Text
                    style={styles.title}
                >

                    ➕ {words.title}

                </Text>


                <Text
                    style={styles.subtitle}
                >

                    {words.subtitle}

                </Text>


            </View>





            {/* Emoji */}


            <View
                style={styles.card}
            >


                <Text
                    style={styles.label}
                >

                    {words.chooseEmoji}

                </Text>


                <View
                    style={
                        styles.emojiGrid
                    }
                >


                    {
                        emojis.map(
                            item=>(


                                <TouchableOpacity

                                    key={item}

                                    style={[

                                        styles.emojiButton,

                                        emoji === item
                                        &&
                                        styles.emojiSelected

                                    ]}

                                    onPress={
                                        ()=>setEmoji(
                                            item
                                        )
                                    }

                                >


                                    <Text
                                        style={
                                            styles.emojiText
                                        }
                                    >

                                        {item}

                                    </Text>


                                </TouchableOpacity>


                            )
                        )
                    }


                </View>


            </View>





            {/* Basic Info */}


            <View
                style={styles.card}
            >


                <Text
                    style={styles.label}
                >

                    {words.habitName}

                </Text>


                <TextInput

                    value={title}

                    onChangeText={
                        setTitle
                    }

                    placeholder={
                        words.habitPlaceholder
                    }

                    placeholderTextColor="#94A3B8"

                    style={styles.input}

                    maxLength={255}

                />




                <Text
                    style={[
                        styles.label,
                        styles.topLabel
                    ]}
                >

                    {words.description}

                </Text>


                <TextInput

                    value={
                        description
                    }

                    onChangeText={
                        setDescription
                    }

                    placeholder={
                        words
                            .descriptionPlaceholder
                    }

                    placeholderTextColor="#94A3B8"

                    style={[
                        styles.input,
                        styles.descriptionInput
                    ]}

                    multiline

                    maxLength={1000}

                    textAlignVertical="top"

                />


            </View>





            {/* Frequency */}


            <View
                style={styles.card}
            >


                <Text
                    style={styles.label}
                >

                    {words.frequency}

                </Text>


                <View
                    style={
                        styles.frequencyRow
                    }
                >


                    {
                        frequencyOptions.map(
                            item=>(


                                <TouchableOpacity

                                    key={
                                        item.key
                                    }

                                    style={[

                                        styles.frequencyButton,

                                        frequency
                                        ===
                                        item.key
                                        &&
                                        {
                                            backgroundColor:
                                                color,

                                            borderColor:
                                                color
                                        }

                                    ]}

                                    onPress={
                                        ()=>setFrequency(
                                            item.key
                                        )
                                    }

                                >


                                    <Text

                                        style={[

                                            styles.frequencyText,

                                            frequency
                                            ===
                                            item.key
                                            &&
                                            styles.frequencyTextSelected

                                        ]}

                                    >

                                        {
                                            item.label
                                        }

                                    </Text>


                                </TouchableOpacity>


                            )
                        )
                    }


                </View>




                <Text
                    style={[
                        styles.label,
                        styles.topLabel
                    ]}
                >

                    {words.target}

                </Text>


                <View
                    style={
                        styles.targetRow
                    }
                >


                    <TextInput

                        value={target}

                        onChangeText={
                            value=>{

                                setTarget(

                                    value.replace(
                                        /[^0-9]/g,
                                        ""
                                    )

                                );

                            }
                        }

                        keyboardType="numeric"

                        maxLength={4}

                        style={[
                            styles.input,
                            styles.targetInput
                        ]}

                    />


                    <Text
                        style={
                            styles.targetUnit
                        }
                    >

                        {words.minutes}

                    </Text>


                </View>


            </View>





            {/* Theme Color */}


            <View
                style={styles.card}
            >


                <Text
                    style={styles.label}
                >

                    {words.theme}

                </Text>


                <View
                    style={
                        styles.colorRow
                    }
                >


                    {
                        colors.map(
                            item=>(


                                <TouchableOpacity

                                    key={item}

                                    onPress={
                                        ()=>setColor(
                                            item
                                        )
                                    }

                                    style={[

                                        styles.colorOuter,

                                        color
                                        ===
                                        item
                                        &&
                                        {
                                            borderColor:
                                                item
                                        }

                                    ]}

                                >


                                    <View

                                        style={[

                                            styles.colorCircle,

                                            {
                                                backgroundColor:
                                                    item
                                            }

                                        ]}

                                    />


                                </TouchableOpacity>


                            )
                        )
                    }


                </View>


            </View>





            {/* Reminder */}


            <View
                style={styles.card}
            >


                <View
                    style={
                        styles.reminderHeader
                    }
                >


                    <View
                        style={
                            styles.reminderTitleArea
                        }
                    >


                        <Text
                            style={styles.label}
                        >

                            🔔 {words.reminder}

                        </Text>


                        <Text
                            style={
                                styles.helperText
                            }
                        >

                            {
                                words
                                    .reminderDescription
                            }

                        </Text>


                    </View>



                    <Switch

                        value={
                            reminderEnabled
                        }

                        onValueChange={
                            setReminderEnabled
                        }

                        trackColor={{

                            false:
                                "#CBD5E1",

                            true:
                                "#86EFAC"

                        }}

                        thumbColor={

                            reminderEnabled
                            ?
                            "#16A34A"
                            :
                            "#F8FAFC"

                        }

                    />


                </View>




                {
                    reminderEnabled
                    &&


                    <View
                        style={
                            styles.reminderArea
                        }
                    >


                        <Text
                            style={[
                                styles.label,
                                styles.topLabel
                            ]}
                        >

                            {
                                words.reminderTime
                            }

                        </Text>



                        <View
                            style={
                                styles.timeRow
                            }
                        >


                            <TextInput

                                value={
                                    reminderHour
                                }

                                onChangeText={
                                    value=>{

                                        setReminderHour(

                                            value.replace(
                                                /[^0-9]/g,
                                                ""
                                            )
                                            .slice(
                                                0,
                                                2
                                            )

                                        );

                                    }
                                }

                                keyboardType="numeric"

                                style={
                                    styles.timeInput
                                }

                            />


                            <Text
                                style={
                                    styles.timeSeparator
                                }
                            >

                                :

                            </Text>


                            <TextInput

                                value={
                                    reminderMinute
                                }

                                onChangeText={
                                    value=>{

                                        setReminderMinute(

                                            value.replace(
                                                /[^0-9]/g,
                                                ""
                                            )
                                            .slice(
                                                0,
                                                2
                                            )

                                        );

                                    }
                                }

                                keyboardType="numeric"

                                style={
                                    styles.timeInput
                                }

                            />


                        </View>




                        <View
                            style={
                                styles.presetRow
                            }
                        >


                            <TimePreset

                                label="07:00"

                                onPress={
                                    ()=>setTimePreset(
                                        7,
                                        0
                                    )
                                }

                            />


                            <TimePreset

                                label="12:00"

                                onPress={
                                    ()=>setTimePreset(
                                        12,
                                        0
                                    )
                                }

                            />


                            <TimePreset

                                label="18:00"

                                onPress={
                                    ()=>setTimePreset(
                                        18,
                                        0
                                    )
                                }

                            />


                            <TimePreset

                                label="21:00"

                                onPress={
                                    ()=>setTimePreset(
                                        21,
                                        0
                                    )
                                }

                            />


                        </View>



                        <Text
                            style={
                                styles.notificationNote
                            }
                        >

                            {words.notificationNote}

                        </Text>


                    </View>

                }


            </View>





            {/* Preview */}


            <View

                style={[
                    styles.previewCard,
                    {
                        borderColor:
                            color
                    }
                ]}

            >


                <View
                    style={styles.previewHeader}
                >


                    <Text
                        style={styles.previewEmoji}
                    >

                        {emoji}

                    </Text>


                    <View
                        style={{flex:1}}
                    >


                        <Text
                            style={styles.previewTitle}
                        >

                            {
                                title.trim()
                                ||
                                words.habitPlaceholder
                            }

                        </Text>


                        <Text
                            style={styles.previewMeta}
                        >

                            {
                                frequencyOptions
                                    .find(
                                        item =>
                                            item.key
                                            ===
                                            frequency
                                    )
                                    ?.label
                            }

                            {" • "}

                            {
                                target
                                || 0
                            }

                            {" "}

                            {words.minutes}

                        </Text>


                    </View>


                    <View

                        style={[
                            styles.previewColor,
                            {
                                backgroundColor:
                                    color
                            }
                        ]}

                    />


                </View>


            </View>





            {/* Create Button */}


            <TouchableOpacity

                style={[

                    styles.createButton,

                    {
                        backgroundColor:
                            color
                    },

                    loading
                    &&
                    styles.createDisabled

                ]}

                onPress={
                    createHabit
                }

                disabled={
                    loading
                }

                activeOpacity={0.85}

            >


                {
                    loading
                    ?


                    <ActivityIndicator
                        color="#FFFFFF"
                    />


                    :


                    <Text
                        style={
                            styles.createText
                        }
                    >

                        + {words.create}

                    </Text>

                }


            </TouchableOpacity>



        </ScrollView>


    );


}





/*
|--------------------------------------------------------------------------
| Time Preset
|--------------------------------------------------------------------------
*/


function TimePreset({
    label,
    onPress
}){


    return(


        <TouchableOpacity

            style={
                styles.timePreset
            }

            onPress={
                onPress
            }

        >


            <Text
                style={
                    styles.timePresetText
                }
            >

                {label}

            </Text>


        </TouchableOpacity>


    );


}





const styles =
StyleSheet.create({


    container:{

        flex:1,

        backgroundColor:
            "#F8FAFC"

    },


    content:{

        width:"100%",

        maxWidth:800,

        alignSelf:"center",

        paddingHorizontal:16,

        paddingTop:
            Platform.OS === "ios"
            ? 55
            : 35,

        paddingBottom:120

    },


    header:{

        marginBottom:20

    },


    title:{

        fontSize:27,

        fontWeight:"800",

        color:"#14532D"

    },


    subtitle:{

        fontSize:14,

        color:"#64748B",

        marginTop:5

    },


    card:{

        backgroundColor:
            "#FFFFFF",

        borderRadius:20,

        padding:17,

        marginBottom:14,

        borderWidth:1,

        borderColor:"#E2E8F0"

    },


    label:{

        fontSize:14,

        fontWeight:"800",

        color:"#334155",

        marginBottom:9

    },


    topLabel:{

        marginTop:17

    },


    input:{

        minHeight:48,

        borderRadius:14,

        backgroundColor:
            "#F8FAFC",

        borderWidth:1,

        borderColor:"#E2E8F0",

        paddingHorizontal:14,

        fontSize:15,

        color:"#0F172A"

    },


    descriptionInput:{

        height:95,

        paddingTop:13

    },


    emojiGrid:{

        flexDirection:"row",

        flexWrap:"wrap",

        marginHorizontal:-4

    },


    emojiButton:{

        width:52,

        height:52,

        margin:4,

        borderRadius:15,

        backgroundColor:
            "#F8FAFC",

        borderWidth:1,

        borderColor:"#E2E8F0",

        justifyContent:"center",

        alignItems:"center"

    },


    emojiSelected:{

        backgroundColor:
            "#DCFCE7",

        borderColor:
            "#16A34A",

        borderWidth:2

    },


    emojiText:{

        fontSize:25

    },


    frequencyRow:{

        flexDirection:"row",

        marginHorizontal:-4

    },


    frequencyButton:{

        flex:1,

        marginHorizontal:4,

        paddingVertical:12,

        borderRadius:13,

        backgroundColor:
            "#F8FAFC",

        borderWidth:1,

        borderColor:
            "#E2E8F0",

        alignItems:"center"

    },


    frequencyText:{

        fontSize:12,

        fontWeight:"700",

        color:"#64748B"

    },


    frequencyTextSelected:{

        color:"#FFFFFF"

    },


    targetRow:{

        flexDirection:"row",

        alignItems:"center"

    },


    targetInput:{

        width:110,

        textAlign:"center",

        fontSize:17,

        fontWeight:"800"

    },


    targetUnit:{

        marginLeft:12,

        color:"#64748B",

        fontSize:14

    },


    colorRow:{

        flexDirection:"row",

        flexWrap:"wrap",

        marginHorizontal:-4

    },


    colorOuter:{

        width:46,

        height:46,

        margin:4,

        borderRadius:23,

        borderWidth:2,

        borderColor:
            "transparent",

        justifyContent:"center",

        alignItems:"center"

    },


    colorCircle:{

        width:32,

        height:32,

        borderRadius:16

    },


    reminderHeader:{

        flexDirection:"row",

        justifyContent:
            "space-between",

        alignItems:"center"

    },


    reminderTitleArea:{

        flex:1,

        marginRight:15

    },


    helperText:{

        color:"#64748B",

        fontSize:12,

        lineHeight:17

    },


    reminderArea:{

        marginTop:8

    },


    timeRow:{

        flexDirection:"row",

        alignItems:"center"

    },


    timeInput:{

        width:75,

        height:50,

        borderRadius:14,

        borderWidth:1,

        borderColor:"#E2E8F0",

        backgroundColor:
            "#F8FAFC",

        textAlign:"center",

        fontSize:20,

        fontWeight:"800",

        color:"#0F172A"

    },


    timeSeparator:{

        fontSize:24,

        fontWeight:"800",

        color:"#64748B",

        marginHorizontal:10

    },


    presetRow:{

        flexDirection:"row",

        flexWrap:"wrap",

        marginTop:12,

        marginHorizontal:-3

    },


    timePreset:{

        margin:3,

        backgroundColor:
            "#F0FDF4",

        borderRadius:10,

        paddingHorizontal:12,

        paddingVertical:8

    },


    timePresetText:{

        color:"#15803D",

        fontWeight:"700",

        fontSize:12

    },


    notificationNote:{

        marginTop:10,

        fontSize:10,

        lineHeight:15,

        color:"#94A3B8"

    },


    previewCard:{

        borderRadius:19,

        backgroundColor:
            "#FFFFFF",

        padding:16,

        borderWidth:2,

        marginBottom:16

    },


    previewHeader:{

        flexDirection:"row",

        alignItems:"center"

    },


    previewEmoji:{

        fontSize:30,

        marginRight:12

    },


    previewTitle:{

        fontSize:16,

        fontWeight:"800",

        color:"#0F172A"

    },


    previewMeta:{

        marginTop:3,

        color:"#64748B",

        fontSize:12

    },


    previewColor:{

        width:13,

        height:42,

        borderRadius:7,

        marginLeft:12

    },


    createButton:{

        minHeight:56,

        borderRadius:17,

        justifyContent:"center",

        alignItems:"center",

        marginBottom:25

    },


    createDisabled:{

        opacity:0.65

    },


    createText:{

        color:"#FFFFFF",

        fontSize:16,

        fontWeight:"800"

    }


});