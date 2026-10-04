import React, {
    useCallback,
    useEffect,
    useState
} from "react";


import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    RefreshControl
} from "react-native";


import api from "../api/api";


import {
    removeToken
} from "../storage/token";


import HabitCard
from "../components/HabitCard";


import i18n
from "../localization/i18n";





export default function HomeScreen({
    navigation
}){


    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */


    const [analytics,setAnalytics] =
        useState({});


    const [habits,setHabits] =
        useState([]);


    const [insight,setInsight] =
        useState("");


    const [profile,setProfile] =
        useState({});


    const [loading,setLoading] =
        useState(true);


    const [refreshing,setRefreshing] =
        useState(false);





    /*
    |--------------------------------------------------------------------------
    | Language
    |--------------------------------------------------------------------------
    */


    const isBangla =
        String(
            i18n.locale || ""
        )
        .toLowerCase()
        .startsWith("bn");



    const words = {

        welcome:isBangla
            ? "স্বাগতম"
            : "Welcome",


        todaysHabits:isBangla
            ? "আজকের অভ্যাস"
            : "Today's Habits",


        addHabit:isBangla
            ? "অভ্যাস যোগ করুন"
            : "Add Habit",


        noHabits:isBangla
            ? "এখনও কোনো habit তৈরি করা হয়নি।"
            : "No habits created yet.",


        startHabit:isBangla
            ? "আপনার প্রথম habit তৈরি করুন"
            : "Create your first habit",


        todayProgress:isBangla
            ? "আজকের অগ্রগতি"
            : "Today's Progress",


        completedToday:isBangla
            ? "আজ সম্পন্ন"
            : "Completed Today",


        totalHabits:isBangla
            ? "মোট অভ্যাস"
            : "Total Habits",


        aiCoach:isBangla
            ? "AI Habit Coach"
            : "AI Habit Coach",


        openCoach:isBangla
            ? "AI Coach খুলুন"
            : "Open AI Coach",


        logout:isBangla
            ? "লগআউট"
            : "Logout",


        success:isBangla
            ? "সফল 🎉"
            : "Success 🎉",


        alreadyCompleted:isBangla
            ? "এই habit আজ ইতোমধ্যে complete করা হয়েছে।"
            : "This habit has already been completed today.",


        achievementUnlocked:isBangla
            ? "নতুন Achievement আনলক! 🏆"
            : "Achievement Unlocked! 🏆"

    };





    /*
    |--------------------------------------------------------------------------
    | Load Dashboard Data
    |--------------------------------------------------------------------------
    */


    const loadData =
        useCallback(
            async(
                showLoader = true
            )=>{


                if(showLoader){

                    setLoading(true);

                }


                try{


                    /*
                    |--------------------------------------------------------------------------
                    | Load all dashboard APIs together
                    |--------------------------------------------------------------------------
                    */


                    const [

                        analyticsResponse,

                        habitsResponse,

                        insightResponse,

                        profileResponse

                    ] =
                        await Promise.all([

                            api.get(
                                "/analytics"
                            ),

                            api.get(
                                "/habits"
                            ),

                            api.get(
                                "/ai-insights"
                            ),

                            api.get(
                                "/profile"
                            )

                        ]);



                    /*
                    |--------------------------------------------------------------------------
                    | Analytics
                    |--------------------------------------------------------------------------
                    */


                    setAnalytics(
                        analyticsResponse.data
                        || {}
                    );



                    /*
                    |--------------------------------------------------------------------------
                    | Habits
                    |--------------------------------------------------------------------------
                    */


                    const habitData =
                        habitsResponse.data;


                    setHabits(

                        Array.isArray(
                            habitData
                        )
                        ?
                        habitData
                        :
                        (
                            habitData?.habits
                            || []
                        )

                    );



                    /*
                    |--------------------------------------------------------------------------
                    | AI Insight
                    |--------------------------------------------------------------------------
                    */


                    setInsight(

                        insightResponse
                            ?.data
                            ?.insight
                        || ""

                    );



                    /*
                    |--------------------------------------------------------------------------
                    | Profile
                    |--------------------------------------------------------------------------
                    */


                    setProfile(

                        profileResponse.data
                        || {}

                    );


                }

                catch(error){


                    console.log(

                        "HOME ERROR:",

                        error?.response?.data
                        ||
                        error?.message
                        ||
                        error

                    );


                }

                finally{


                    setLoading(false);

                    setRefreshing(false);


                }


            },
            []
        );





    /*
    |--------------------------------------------------------------------------
    | Reload When Home Tab Gets Focus
    |--------------------------------------------------------------------------
    */


    useEffect(()=>{


        const unsubscribe =
            navigation.addListener(

                "focus",

                ()=>{

                    loadData();

                }

            );


        return unsubscribe;


    },[
        navigation,
        loadData
    ]);





    /*
    |--------------------------------------------------------------------------
    | Pull To Refresh
    |--------------------------------------------------------------------------
    */


    const refresh =
        ()=>{


            setRefreshing(true);


            loadData(
                false
            );


        };





    /*
    |--------------------------------------------------------------------------
    | Complete Habit
    |--------------------------------------------------------------------------
    */


    const completeHabit =
        async(id)=>{


            try{


                const response =
                    await api.post(

                        `/habits/${id}/complete`

                    );



                const data =
                    response.data;


                const reward =
                    data?.reward
                    || {};


                const xpAdded =
                    reward.total_xp_added
                    ??
                    reward.xp_added
                    ??
                    reward.habit_xp
                    ??
                    0;


                const coinsAdded =
                    reward.total_coins_added
                    ??
                    reward.coins_added
                    ??
                    reward.habit_coins
                    ??
                    0;



                /*
                |--------------------------------------------------------------------------
                | Newly Unlocked Achievement
                |--------------------------------------------------------------------------
                */


                const newlyUnlocked =
                    data?.newly_unlocked
                    || [];


                if(
                    newlyUnlocked.length > 0
                ){


                    const achievement =
                        newlyUnlocked[0];


                    const achievementTitle =
                        isBangla
                        ?
                        (
                            achievement.title_bn
                            ||
                            achievement.title
                        )
                        :
                        achievement.title;



                    Alert.alert(

                        words.achievementUnlocked,

                        `${
                            achievement.badge
                            || "🏆"
                        } ${
                            achievementTitle
                        }\n\n+${
                            achievement.reward_xp
                            || 0
                        } XP • +${
                            achievement.reward_coins
                            || 0
                        } Coins`

                    );


                }
                else{


                    /*
                    |--------------------------------------------------------------------------
                    | Normal Completion Reward
                    |--------------------------------------------------------------------------
                    */


                    Alert.alert(

                        words.success,

                        `+${xpAdded} XP  •  +${coinsAdded} Coins`

                    );


                }



                /*
                Reload dashboard stats
                */


                await loadData(
                    false
                );


            }

            catch(error){


                console.log(

                    "COMPLETE HABIT ERROR:",

                    error?.response?.data
                    ||
                    error?.message
                    ||
                    error

                );


                const status =
                    error?.response?.status;


                const message =
                    error
                        ?.response
                        ?.data
                        ?.message;



                if(status === 409){


                    Alert.alert(

                        "Info",

                        words.alreadyCompleted

                    );


                    return;

                }



                Alert.alert(

                    i18n.t("error"),

                    message
                    ||
                    "Could not complete habit."

                );


            }


        };





    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */


    const logout =
        async()=>{


            try{


                /*
                Revoke backend token
                */


                await api.post(
                    "/logout"
                );


            }

            catch(error){


                /*
                Even if server logout fails,
                remove local token.
                */


                console.log(

                    "LOGOUT API ERROR:",

                    error?.response?.data
                    ||
                    error?.message

                );


            }

            finally{


                await removeToken();


                navigation.replace(
                    "Login"
                );


            }


        };





    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */


    if(loading){


        return(


            <View
                style={styles.loadingContainer}
            >


                <ActivityIndicator

                    size="large"

                    color="#16A34A"

                />


            </View>


        );


    }





    /*
    |--------------------------------------------------------------------------
    | Main UI
    |--------------------------------------------------------------------------
    */


    return(


        <ScrollView

            style={styles.container}

            contentContainerStyle={
                styles.contentContainer
            }

            showsVerticalScrollIndicator={
                false
            }

            refreshControl={

                <RefreshControl

                    refreshing={
                        refreshing
                    }

                    onRefresh={
                        refresh
                    }

                    tintColor="#16A34A"

                />

            }

        >



            {/* Welcome Header */}


            <Text
                style={styles.header}
            >

                {
                    words.welcome
                }{" "}

                {
                    profile?.name
                    || "User"
                } 👋

            </Text>


            <Text
                style={styles.headerSubtitle}
            >

                {
                    isBangla
                    ? "আজ আপনার habits আরও এক ধাপ এগিয়ে নিন।"
                    : "Take one more step toward better habits today."
                }

            </Text>





            {/* Level Card */}


            <View
                style={styles.levelCard}
            >


                <View
                    style={styles.levelTopRow}
                >


                    <View>


                        <Text
                            style={styles.level}
                        >

                            ⭐ {i18n.t("level")}{" "}

                            {
                                analytics.level
                                ??
                                profile.level
                                ??
                                1
                            }

                        </Text>


                        <Text
                            style={styles.xp}
                        >

                            ⚡ {i18n.t("xp")}{" "}

                            {
                                analytics.xp
                                ??
                                profile.xp
                                ??
                                0
                            }

                        </Text>


                    </View>



                    <View
                        style={styles.coinBadge}
                    >


                        <Text
                            style={styles.coinText}
                        >

                            🪙 {
                                analytics.coins
                                ??
                                profile.coins
                                ??
                                0
                            }

                        </Text>


                    </View>


                </View>




                <Text
                    style={styles.streak}
                >

                    🔥 {
                        analytics.current_streak
                        ??
                        profile.current_streak
                        ??
                        0
                    }{" "}

                    {i18n.t("streak")}

                </Text>




                <View
                    style={styles.xpBarBackground}
                >


                    <View

                        style={[

                            styles.xpBarFill,

                            {

                                width:
                                    `${
                                        Math.min(
                                            (
                                                analytics.xp
                                                ??
                                                profile.xp
                                                ??
                                                0
                                            )
                                            %
                                            100,
                                            100
                                        )
                                    }%`

                            }

                        ]}

                    />


                </View>


            </View>





            {/* Today's Progress */}


            <View
                style={styles.progress}
            >


                <View
                    style={styles.progressHeader}
                >


                    <Text
                        style={styles.progressTitle}
                    >

                        {
                            words.todayProgress
                        }

                    </Text>


                    <Text
                        style={styles.percent}
                    >

                        {
                            analytics.completion_rate
                            ?? 0
                        }%

                    </Text>


                </View>




                <View
                    style={styles.progressBarBackground}
                >


                    <View

                        style={[

                            styles.progressBarFill,

                            {

                                width:
                                    `${
                                        Math.min(
                                            analytics.completion_rate
                                            ?? 0,
                                            100
                                        )
                                    }%`

                            }

                        ]}

                    />


                </View>




                <View
                    style={styles.progressStats}
                >


                    <View
                        style={styles.progressStat}
                    >


                        <Text
                            style={styles.progressStatValue}
                        >

                            {
                                analytics.completed_today
                                ?? 0
                            }

                        </Text>


                        <Text
                            style={styles.progressStatLabel}
                        >

                            {
                                words.completedToday
                            }

                        </Text>


                    </View>



                    <View
                        style={styles.progressDivider}
                    />



                    <View
                        style={styles.progressStat}
                    >


                        <Text
                            style={styles.progressStatValue}
                        >

                            {
                                analytics.total_habits
                                ?? habits.length
                            }

                        </Text>


                        <Text
                            style={styles.progressStatLabel}
                        >

                            {
                                words.totalHabits
                            }

                        </Text>


                    </View>


                </View>


            </View>





            {/* Habit Section Header */}


            <View
                style={styles.sectionHeader}
            >


                <Text
                    style={styles.section}
                >

                    🌱 {
                        words.todaysHabits
                    }

                </Text>




                <TouchableOpacity

                    style={styles.smallAddButton}

                    onPress={()=>{

                        navigation.navigate(
                            "AddHabit"
                        );

                    }}

                    activeOpacity={0.8}

                >


                    <Text
                        style={styles.smallAddText}
                    >

                        + {words.addHabit}

                    </Text>


                </TouchableOpacity>


            </View>





            {/* Habits */}


            {

                habits.length === 0

                ?


                <View
                    style={styles.emptyCard}
                >


                    <Text
                        style={styles.emptyEmoji}
                    >

                        🌱

                    </Text>


                    <Text
                        style={styles.emptyTitle}
                    >

                        {words.noHabits}

                    </Text>


                    <Text
                        style={styles.emptyDescription}
                    >

                        {
                            isBangla
                            ? "একটি ছোট habit তৈরি করে আপনার journey শুরু করুন।"
                            : "Start your journey by creating one small habit."
                        }

                    </Text>




                    <TouchableOpacity

                        style={styles.addHabitButton}

                        onPress={()=>{

                            navigation.navigate(
                                "AddHabit"
                            );

                        }}

                    >


                        <Text
                            style={styles.addHabitText}
                        >

                            + {words.startHabit}

                        </Text>


                    </TouchableOpacity>


                </View>


                :


                habits.map(
                    item=>(


                        <HabitCard

                            key={
                                item.id
                            }

                            habit={
                                item
                            }

                            onComplete={
                                completeHabit
                            }

                        />


                    )
                )

            }





            {/* Main Add Habit Button */}


            {
                habits.length > 0
                &&


                <TouchableOpacity

                    style={styles.addHabitButton}

                    onPress={()=>{

                        navigation.navigate(
                            "AddHabit"
                        );

                    }}

                    activeOpacity={0.85}

                >


                    <Text
                        style={styles.addHabitText}
                    >

                        ＋ {words.addHabit}

                    </Text>


                </TouchableOpacity>

            }





            {/* AI Coach */}


            <TouchableOpacity

                style={styles.ai}

                activeOpacity={0.85}

                onPress={()=>{

                    navigation.navigate(
                        "Coach"
                    );

                }}

            >


                <View
                    style={styles.aiHeader}
                >


                    <Text
                        style={styles.aiTitle}
                    >

                        🤖 {
                            words.aiCoach
                        }

                    </Text>


                    <Text
                        style={styles.aiArrow}
                    >

                        ›

                    </Text>


                </View>



                <Text
                    style={styles.aiInsight}
                >

                    {
                        insight
                        ||
                        (
                            isBangla
                            ? "আপনার habit data track করতে থাকুন।"
                            : "Keep tracking your habits for smarter coaching."
                        )
                    }

                </Text>



                <Text
                    style={styles.aiOpenText}
                >

                    {words.openCoach} →

                </Text>


            </TouchableOpacity>





            {/* Logout */}


            <TouchableOpacity

                style={styles.logout}

                onPress={
                    logout
                }

            >


                <Text
                    style={styles.logoutText}
                >

                    {words.logout}

                </Text>


            </TouchableOpacity>



        </ScrollView>


    );


}





const styles =
StyleSheet.create({


    container:{

        flex:1,

        backgroundColor:"#F0FDF4"

    },


    contentContainer:{

        paddingHorizontal:20,

        paddingBottom:50

    },


    loadingContainer:{

        flex:1,

        justifyContent:"center",

        alignItems:"center",

        backgroundColor:"#F0FDF4"

    },


    header:{

        fontSize:27,

        fontWeight:"800",

        marginTop:40,

        color:"#0F172A"

    },


    headerSubtitle:{

        marginTop:5,

        color:"#64748B",

        fontSize:13

    },


    /*
    |--------------------------------------------------------------------------
    | Level Card
    |--------------------------------------------------------------------------
    */


    levelCard:{

        backgroundColor:"#16A34A",

        padding:22,

        borderRadius:24,

        marginTop:20

    },


    levelTopRow:{

        flexDirection:"row",

        justifyContent:"space-between",

        alignItems:"flex-start"

    },


    level:{

        color:"#FFFFFF",

        fontSize:23,

        fontWeight:"800"

    },


    xp:{

        color:"#DCFCE7",

        marginTop:7,

        fontSize:14,

        fontWeight:"700"

    },


    streak:{

        color:"#FEF08A",

        marginTop:14,

        fontWeight:"800",

        fontSize:14

    },


    coinBadge:{

        backgroundColor:"rgba(255,255,255,0.18)",

        paddingHorizontal:12,

        paddingVertical:7,

        borderRadius:14

    },


    coinText:{

        color:"#FFFFFF",

        fontWeight:"800"

    },


    xpBarBackground:{

        height:8,

        backgroundColor:"rgba(255,255,255,0.25)",

        borderRadius:5,

        overflow:"hidden",

        marginTop:16

    },


    xpBarFill:{

        height:"100%",

        backgroundColor:"#FEF08A",

        borderRadius:5

    },


    /*
    |--------------------------------------------------------------------------
    | Progress
    |--------------------------------------------------------------------------
    */


    progress:{

        backgroundColor:"#FFFFFF",

        padding:20,

        borderRadius:22,

        marginTop:18,

        borderWidth:1,

        borderColor:"#DCFCE7"

    },


    progressHeader:{

        flexDirection:"row",

        justifyContent:"space-between",

        alignItems:"center"

    },


    progressTitle:{

        fontSize:17,

        fontWeight:"700",

        color:"#334155"

    },


    percent:{

        fontSize:30,

        fontWeight:"900",

        color:"#16A34A"

    },


    progressBarBackground:{

        height:10,

        backgroundColor:"#E2E8F0",

        borderRadius:6,

        overflow:"hidden",

        marginTop:15

    },


    progressBarFill:{

        height:"100%",

        backgroundColor:"#16A34A",

        borderRadius:6

    },


    progressStats:{

        flexDirection:"row",

        marginTop:18

    },


    progressStat:{

        flex:1,

        alignItems:"center"

    },


    progressStatValue:{

        fontSize:20,

        fontWeight:"800",

        color:"#14532D"

    },


    progressStatLabel:{

        fontSize:11,

        color:"#64748B",

        marginTop:4

    },


    progressDivider:{

        width:1,

        backgroundColor:"#E2E8F0"

    },


    /*
    |--------------------------------------------------------------------------
    | Habits
    |--------------------------------------------------------------------------
    */


    sectionHeader:{

        flexDirection:"row",

        alignItems:"center",

        justifyContent:"space-between",

        marginTop:26,

        marginBottom:10

    },


    section:{

        fontSize:20,

        fontWeight:"800",

        color:"#0F172A",

        flex:1

    },


    smallAddButton:{

        backgroundColor:"#DCFCE7",

        paddingHorizontal:11,

        paddingVertical:8,

        borderRadius:12,

        marginLeft:8

    },


    smallAddText:{

        color:"#15803D",

        fontSize:11,

        fontWeight:"800"

    },


    emptyCard:{

        backgroundColor:"#FFFFFF",

        borderRadius:22,

        padding:25,

        alignItems:"center",

        marginTop:5,

        borderWidth:1,

        borderColor:"#DCFCE7"

    },


    emptyEmoji:{

        fontSize:40

    },


    emptyTitle:{

        marginTop:10,

        fontSize:16,

        fontWeight:"800",

        color:"#334155"

    },


    emptyDescription:{

        marginTop:6,

        color:"#64748B",

        fontSize:12,

        textAlign:"center",

        lineHeight:18

    },


    addHabitButton:{

        backgroundColor:"#16A34A",

        minHeight:52,

        borderRadius:16,

        justifyContent:"center",

        alignItems:"center",

        marginTop:16

    },


    addHabitText:{

        color:"#FFFFFF",

        fontSize:15,

        fontWeight:"800"

    },


    /*
    |--------------------------------------------------------------------------
    | AI Coach
    |--------------------------------------------------------------------------
    */


    ai:{

        backgroundColor:"#DCFCE7",

        padding:19,

        borderRadius:20,

        marginTop:24,

        borderWidth:1,

        borderColor:"#BBF7D0"

    },


    aiHeader:{

        flexDirection:"row",

        alignItems:"center",

        justifyContent:"space-between"

    },


    aiTitle:{

        fontSize:17,

        fontWeight:"800",

        color:"#14532D"

    },


    aiArrow:{

        fontSize:28,

        color:"#16A34A",

        fontWeight:"700"

    },


    aiInsight:{

        marginTop:9,

        color:"#334155",

        lineHeight:20,

        fontSize:13

    },


    aiOpenText:{

        marginTop:12,

        color:"#15803D",

        fontWeight:"800",

        fontSize:12

    },


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */


    logout:{

        backgroundColor:"#EF4444",

        padding:15,

        borderRadius:15,

        marginTop:28,

        marginBottom:40

    },


    logoutText:{

        color:"#FFFFFF",

        textAlign:"center",

        fontWeight:"800"

    }


});