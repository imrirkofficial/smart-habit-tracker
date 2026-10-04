import React, {
    useCallback,
    useMemo,
    useState
} from "react";


import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    useWindowDimensions,
    Platform
} from "react-native";


import {
    LineChart
} from "react-native-chart-kit";


import {
    useFocusEffect
} from "@react-navigation/native";


import api from "../api/api";


import i18n
from "../localization/i18n";





export default function AnalyticsScreen(){


    const {
        width
    } = useWindowDimensions();


    const [analytics,setAnalytics] =
        useState(null);


    const [loading,setLoading] =
        useState(true);


    const [refreshing,setRefreshing] =
        useState(false);


    const [error,setError] =
        useState("");



    const isBangla =
        String(
            i18n.locale || ""
        )
        .toLowerCase()
        .startsWith("bn");



    /*
    |--------------------------------------------------------------------------
    | Screen Text
    |--------------------------------------------------------------------------
    */


    const words = {

        title:isBangla
            ? "বিশ্লেষণ"
            : "Analytics",


        subtitle:isBangla
            ? "আপনার অভ্যাসের অগ্রগতি"
            : "Your habit performance",


        productivity:isBangla
            ? "উৎপাদনশীলতা"
            : "Productivity",


        today:isBangla
            ? "আজকের অগ্রগতি"
            : "Today's Progress",


        weekly:isBangla
            ? "সাপ্তাহিক রিপোর্ট"
            : "Weekly Report",


        monthly:isBangla
            ? "মাসিক রিপোর্ট"
            : "Monthly Report",


        completionRate:isBangla
            ? "সম্পন্নের হার"
            : "Completion Rate",


        habits:isBangla
            ? "মোট অভ্যাস"
            : "Total Habits",


        completedToday:isBangla
            ? "আজ সম্পন্ন"
            : "Completed Today",


        streak:isBangla
            ? "বর্তমান স্ট্রিক"
            : "Current Streak",


        level:isBangla
            ? "লেভেল"
            : "Level",


        xp:isBangla
            ? "XP"
            : "XP",


        coins:isBangla
            ? "কয়েন"
            : "Coins",


        performance:isBangla
            ? "হ্যাবিট পারফরম্যান্স"
            : "Habit Performance",


        completed:isBangla
            ? "সম্পন্ন"
            : "Completed",


        days:isBangla
            ? "দিন"
            : "days",


        bestDay:isBangla
            ? "সেরা দিন"
            : "Best Day",


        noData:isBangla
            ? "এখনও পর্যাপ্ত analytics data নেই।"
            : "There is not enough analytics data yet.",


        retry:isBangla
            ? "আবার চেষ্টা করুন"
            : "Try Again",


        error:isBangla
            ? "Analytics load করা যায়নি।"
            : "Could not load analytics.",


        lastCompleted:isBangla
            ? "শেষ সম্পন্ন"
            : "Last completed",


        never:isBangla
            ? "এখনও নয়"
            : "Never",


        monthlyCompleted:isBangla
            ? "মাসে সম্পন্ন"
            : "Monthly Completed",


        completedDays:isBangla
            ? "সম্পূর্ণ দিন"
            : "Completed Days",


        missedDays:isBangla
            ? "মিসড দিন"
            : "Missed Days"

    };





    /*
    |--------------------------------------------------------------------------
    | Load Analytics
    |--------------------------------------------------------------------------
    */


    const loadAnalytics =
        useCallback(
            async(
                showLoader = true
            )=>{


                if(showLoader){

                    setLoading(true);

                }


                setError("");


                try{


                    const response =
                        await api.get(
                            "/analytics"
                        );


                    setAnalytics(
                        response.data
                    );


                }

                catch(error){


                    console.log(
                        "ANALYTICS ERROR:",
                        error?.response?.data
                        ||
                        error?.message
                        ||
                        error
                    );


                    setError(
                        words.error
                    );


                }

                finally{


                    setLoading(false);

                    setRefreshing(false);


                }


            },
            [
                words.error
            ]
        );





    /*
    |--------------------------------------------------------------------------
    | Reload Every Time Tab Gets Focus
    |--------------------------------------------------------------------------
    */


    useFocusEffect(

        useCallback(()=>{


            loadAnalytics();


        },[
            loadAnalytics
        ])

    );





    /*
    |--------------------------------------------------------------------------
    | Pull To Refresh
    |--------------------------------------------------------------------------
    */


    const refresh =
        ()=>{


            setRefreshing(true);


            loadAnalytics(
                false
            );


        };





    /*
    |--------------------------------------------------------------------------
    | Chart
    |--------------------------------------------------------------------------
    */


    const chartWidth =
        Math.min(
            Math.max(
                width - 32,
                300
            ),
            900
        );



    const weeklyValues =
        useMemo(()=>{


            const values =
                analytics
                    ?.weekly_progress
                || [];


            if(
                !Array.isArray(
                    values
                )
                ||
                values.length === 0
            ){

                return [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ];

            }


            return values.map(
                value =>
                    Number(value) || 0
            );


        },[
            analytics
        ]);



    const weeklyLabels =
        useMemo(()=>{


            const labels =
                analytics
                    ?.weekly_labels
                || [];


            if(
                !Array.isArray(
                    labels
                )
                ||
                labels.length === 0
            ){

                return [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ];

            }


            return labels;


        },[
            analytics
        ]);





    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */


    if(loading){


        return(


            <View
                style={
                    styles.center
                }
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
    | Error
    |--------------------------------------------------------------------------
    */


    if(
        error
        &&
        !analytics
    ){


        return(


            <View
                style={
                    styles.center
                }
            >


                <Text
                    style={
                        styles.errorText
                    }
                >

                    {error}

                </Text>



                <TouchableOpacity

                    style={
                        styles.retryButton
                    }

                    onPress={
                        ()=>loadAnalytics()
                    }

                >


                    <Text
                        style={
                            styles.retryText
                        }
                    >

                        {words.retry}

                    </Text>


                </TouchableOpacity>


            </View>


        );


    }





    const monthly =
        analytics?.monthly
        || {};


    const habitPerformance =
        analytics?.habit_performance
        || [];





    return(


        <ScrollView

            style={
                styles.container
            }

            contentContainerStyle={
                styles.content
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



            {/* Header */}


            <View
                style={
                    styles.header
                }
            >


                <Text
                    style={
                        styles.title
                    }
                >

                    📊 {words.title}

                </Text>


                <Text
                    style={
                        styles.subtitle
                    }
                >

                    {words.subtitle}

                </Text>


            </View>





            {/* Productivity Score */}


            <View
                style={
                    styles.productivityCard
                }
            >


                <View>


                    <Text
                        style={
                            styles.productivityLabel
                        }
                    >

                        {words.productivity}

                    </Text>


                    <Text
                        style={
                            styles.productivityDescription
                        }
                    >

                        {
                            words
                                .weekly
                        }

                        {" + "}

                        {
                            words
                                .monthly
                        }

                    </Text>


                </View>



                <View
                    style={
                        styles.scoreCircle
                    }
                >


                    <Text
                        style={
                            styles.scoreText
                        }
                    >

                        {
                            analytics
                                ?.productivity_score
                            ?? 0
                        }

                    </Text>


                    <Text
                        style={
                            styles.scorePercent
                        }
                    >

                        %

                    </Text>


                </View>


            </View>





            {/* Main Stats */}


            <View
                style={
                    styles.statsGrid
                }
            >


                <StatCard

                    icon="🎯"

                    value={
                        analytics
                            ?.total_habits
                        ?? 0
                    }

                    label={
                        words.habits
                    }

                />


                <StatCard

                    icon="✅"

                    value={
                        analytics
                            ?.completed_today
                        ?? 0
                    }

                    label={
                        words.completedToday
                    }

                />


                <StatCard

                    icon="🔥"

                    value={
                        `${
                            analytics
                                ?.current_streak
                            ?? 0
                        }`
                    }

                    label={
                        words.streak
                    }

                />


                <StatCard

                    icon="⭐"

                    value={
                        analytics
                            ?.level
                        ?? 1
                    }

                    label={
                        words.level
                    }

                />


            </View>





            {/* XP + Coins */}


            <View
                style={
                    styles.rewardRow
                }
            >


                <View
                    style={
                        styles.rewardCard
                    }
                >


                    <Text
                        style={
                            styles.rewardIcon
                        }
                    >

                        ⚡

                    </Text>


                    <View>


                        <Text
                            style={
                                styles.rewardValue
                            }
                        >

                            {
                                analytics
                                    ?.xp
                                ?? 0
                            }

                        </Text>


                        <Text
                            style={
                                styles.rewardLabel
                            }
                        >

                            {words.xp}

                        </Text>


                    </View>


                </View>



                <View
                    style={
                        styles.rewardCard
                    }
                >


                    <Text
                        style={
                            styles.rewardIcon
                        }
                    >

                        🪙

                    </Text>


                    <View>


                        <Text
                            style={
                                styles.rewardValue
                            }
                        >

                            {
                                analytics
                                    ?.coins
                                ?? 0
                            }

                        </Text>


                        <Text
                            style={
                                styles.rewardLabel
                            }
                        >

                            {words.coins}

                        </Text>


                    </View>


                </View>


            </View>





            {/* Today Progress */}


            <View
                style={
                    styles.sectionCard
                }
            >


                <SectionHeader

                    title={
                        words.today
                    }

                    value={
                        `${
                            analytics
                                ?.completion_rate
                            ?? 0
                        }%`
                    }

                />



                <ProgressBar

                    value={
                        analytics
                            ?.completion_rate
                        ?? 0
                    }

                />



                <Text
                    style={
                        styles.smallDescription
                    }
                >

                    {
                        analytics
                            ?.completed_today
                        ?? 0
                    }

                    {" / "}

                    {
                        analytics
                            ?.total_habits
                        ?? 0
                    }

                    {" "}

                    {words.completed}

                </Text>


            </View>





            {/* Weekly Chart */}


            <View
                style={
                    styles.sectionCard
                }
            >


                <SectionHeader

                    title={
                        words.weekly
                    }

                    value={
                        `${
                            analytics
                                ?.weekly_completion_rate
                            ?? 0
                        }%`
                    }

                />



                <View
                    style={
                        styles.chartContainer
                    }
                >


                    <LineChart

                        data={{

                            labels:
                                weeklyLabels,

                            datasets:[
                                {
                                    data:
                                        weeklyValues
                                }
                            ]

                        }}

                        width={
                            chartWidth - 34
                        }

                        height={220}

                        fromZero

                        segments={4}

                        yAxisSuffix="%"

                        withInnerLines

                        withOuterLines={false}

                        bezier

                        chartConfig={{

                            backgroundGradientFrom:
                                "#FFFFFF",

                            backgroundGradientTo:
                                "#FFFFFF",

                            decimalPlaces:0,

                            color:
                                (
                                    opacity = 1
                                ) =>
                                    `rgba(22, 163, 74, ${opacity})`,

                            labelColor:
                                (
                                    opacity = 1
                                ) =>
                                    `rgba(71, 85, 105, ${opacity})`,

                            propsForDots:{

                                r:"4",

                                strokeWidth:"2",

                                stroke:"#16A34A"

                            },

                            propsForBackgroundLines:{

                                stroke:"#E2E8F0",

                                strokeDasharray:"4"

                            }

                        }}

                        style={
                            styles.chart
                        }

                    />


                </View>


            </View>





            {/* Monthly */}


            <View
                style={
                    styles.sectionCard
                }
            >


                <SectionHeader

                    title={
                        words.monthly
                    }

                    value={
                        `${
                            monthly
                                ?.completion_rate
                            ?? 0
                        }%`
                    }

                />



                <ProgressBar

                    value={
                        monthly
                            ?.completion_rate
                        ?? 0
                    }

                />



                <View
                    style={
                        styles.monthStats
                    }
                >


                    <MiniStat

                        value={
                            monthly
                                ?.completed
                            ?? 0
                        }

                        label={
                            words.monthlyCompleted
                        }

                    />


                    <MiniStat

                        value={
                            monthly
                                ?.completed_days
                            ?? 0
                        }

                        label={
                            words.completedDays
                        }

                    />


                    <MiniStat

                        value={
                            monthly
                                ?.missed_days
                            ?? 0
                        }

                        label={
                            words.missedDays
                        }

                    />


                </View>


            </View>





            {/* Best Day */}


            {
                monthly?.best_day
                &&

                <View
                    style={
                        styles.bestCard
                    }
                >


                    <View>


                        <Text
                            style={
                                styles.bestLabel
                            }
                        >

                            🏆 {words.bestDay}

                        </Text>


                        <Text
                            style={
                                styles.bestDate
                            }
                        >

                            {
                                monthly
                                    .best_day
                                    .date
                            }

                            {" • "}

                            {
                                monthly
                                    .best_day
                                    .day
                            }

                        </Text>


                    </View>


                    <Text
                        style={
                            styles.bestRate
                        }
                    >

                        {
                            monthly
                                .best_day
                                .completion_rate
                        }%

                    </Text>


                </View>

            }





            {/* Habit Performance */}


            <View
                style={
                    styles.performanceSection
                }
            >


                <Text
                    style={
                        styles.sectionTitle
                    }
                >

                    🎯 {words.performance}

                </Text>



                {
                    habitPerformance.length === 0

                    ?


                    <View
                        style={
                            styles.emptyCard
                        }
                    >


                        <Text
                            style={
                                styles.emptyText
                            }
                        >

                            {words.noData}

                        </Text>


                    </View>


                    :


                    habitPerformance.map(
                        habit=>(


                            <HabitPerformanceCard

                                key={
                                    habit.id
                                }

                                habit={
                                    habit
                                }

                                words={
                                    words
                                }

                            />


                        )
                    )
                }


            </View>



        </ScrollView>


    );


}





/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/


function StatCard({
    icon,
    value,
    label
}){


    return(


        <View
            style={
                styles.statCard
            }
        >


            <Text
                style={
                    styles.statIcon
                }
            >

                {icon}

            </Text>


            <Text
                style={
                    styles.statValue
                }
            >

                {value}

            </Text>


            <Text
                style={
                    styles.statLabel
                }
            >

                {label}

            </Text>


        </View>


    );


}





/*
|--------------------------------------------------------------------------
| Mini Stat
|--------------------------------------------------------------------------
*/


function MiniStat({
    value,
    label
}){


    return(


        <View
            style={
                styles.miniStat
            }
        >


            <Text
                style={
                    styles.miniValue
                }
            >

                {value}

            </Text>


            <Text
                style={
                    styles.miniLabel
                }
            >

                {label}

            </Text>


        </View>


    );


}





/*
|--------------------------------------------------------------------------
| Section Header
|--------------------------------------------------------------------------
*/


function SectionHeader({
    title,
    value
}){


    return(


        <View
            style={
                styles.sectionHeader
            }
        >


            <Text
                style={
                    styles.sectionTitle
                }
            >

                {title}

            </Text>


            <Text
                style={
                    styles.sectionValue
                }
            >

                {value}

            </Text>


        </View>


    );


}





/*
|--------------------------------------------------------------------------
| Progress Bar
|--------------------------------------------------------------------------
*/


function ProgressBar({
    value
}){


    const safeValue =
        Math.max(
            0,
            Math.min(
                100,
                Number(value) || 0
            )
        );


    return(


        <View
            style={
                styles.progressBackground
            }
        >


            <View

                style={[

                    styles.progressFill,

                    {
                        width:
                            `${safeValue}%`
                    }

                ]}

            />


        </View>


    );


}





/*
|--------------------------------------------------------------------------
| Habit Performance
|--------------------------------------------------------------------------
*/


function HabitPerformanceCard({
    habit,
    words
}){


    const rate =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    habit.completion_rate
                )
                || 0
            )
        );


    return(


        <View
            style={
                styles.habitCard
            }
        >


            <View
                style={
                    styles.habitHeader
                }
            >


                <View
                    style={
                        styles.habitTitleWrapper
                    }
                >


                    <Text
                        style={
                            styles.habitIcon
                        }
                    >

                        🌱

                    </Text>


                    <View
                        style={{
                            flex:1
                        }}
                    >


                        <Text
                            style={
                                styles.habitTitle
                            }
                        >

                            {
                                habit.title
                            }

                        </Text>


                        <Text
                            style={
                                styles.habitMeta
                            }
                        >

                            {
                                habit.completed_days
                                ?? 0
                            }

                            {" / "}

                            {
                                habit.possible_days
                                ?? 0
                            }

                            {" "}

                            {words.days}

                        </Text>


                    </View>


                </View>



                <Text
                    style={
                        styles.habitRate
                    }
                >

                    {rate}%

                </Text>


            </View>



            <ProgressBar
                value={
                    rate
                }
            />



            <Text
                style={
                    styles.lastCompleted
                }
            >

                {
                    words.lastCompleted
                }

                {": "}

                {
                    habit.last_completed
                    ||
                    words.never
                }

            </Text>


        </View>


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

        maxWidth:950,

        alignSelf:"center",

        paddingHorizontal:16,

        paddingTop:
            Platform.OS === "ios"
            ? 55
            : 38,

        paddingBottom:120

    },


    center:{

        flex:1,

        alignItems:"center",

        justifyContent:"center",

        backgroundColor:
            "#F8FAFC",

        padding:20

    },


    header:{

        marginBottom:20

    },


    title:{

        fontSize:28,

        fontWeight:"800",

        color:"#14532D"

    },


    subtitle:{

        fontSize:14,

        color:"#64748B",

        marginTop:5

    },


    productivityCard:{

        backgroundColor:
            "#14532D",

        borderRadius:22,

        padding:20,

        marginBottom:16,

        flexDirection:"row",

        justifyContent:
            "space-between",

        alignItems:"center"

    },


    productivityLabel:{

        fontSize:19,

        fontWeight:"800",

        color:"#FFFFFF"

    },


    productivityDescription:{

        marginTop:6,

        color:"#BBF7D0",

        fontSize:12

    },


    scoreCircle:{

        width:72,

        height:72,

        borderRadius:36,

        backgroundColor:
            "#DCFCE7",

        alignItems:"center",

        justifyContent:"center",

        flexDirection:"row"

    },


    scoreText:{

        fontSize:27,

        fontWeight:"900",

        color:"#166534"

    },


    scorePercent:{

        fontSize:13,

        fontWeight:"800",

        color:"#166534",

        marginTop:8

    },


    statsGrid:{

        flexDirection:"row",

        flexWrap:"wrap",

        marginHorizontal:-5,

        marginBottom:6

    },


    statCard:{

        width:"47%",

        flexGrow:1,

        backgroundColor:"#FFFFFF",

        borderRadius:18,

        padding:16,

        margin:5,

        borderWidth:1,

        borderColor:"#E2E8F0"

    },


    statIcon:{

        fontSize:21,

        marginBottom:8

    },


    statValue:{

        fontSize:24,

        fontWeight:"800",

        color:"#0F172A"

    },


    statLabel:{

        marginTop:4,

        fontSize:12,

        color:"#64748B"

    },


    rewardRow:{

        flexDirection:"row",

        marginHorizontal:-5,

        marginBottom:6

    },


    rewardCard:{

        flex:1,

        margin:5,

        padding:15,

        borderRadius:18,

        backgroundColor:"#FFFFFF",

        borderWidth:1,

        borderColor:"#E2E8F0",

        flexDirection:"row",

        alignItems:"center"

    },


    rewardIcon:{

        fontSize:25,

        marginRight:12

    },


    rewardValue:{

        fontSize:21,

        fontWeight:"800",

        color:"#0F172A"

    },


    rewardLabel:{

        fontSize:12,

        color:"#64748B"

    },


    sectionCard:{

        backgroundColor:"#FFFFFF",

        borderRadius:20,

        padding:17,

        marginTop:12,

        borderWidth:1,

        borderColor:"#E2E8F0"

    },


    sectionHeader:{

        flexDirection:"row",

        justifyContent:
            "space-between",

        alignItems:"center",

        marginBottom:15

    },


    sectionTitle:{

        fontSize:17,

        fontWeight:"800",

        color:"#0F172A"

    },


    sectionValue:{

        fontSize:20,

        fontWeight:"800",

        color:"#16A34A"

    },


    progressBackground:{

        height:10,

        borderRadius:6,

        backgroundColor:"#E2E8F0",

        overflow:"hidden"

    },


    progressFill:{

        height:"100%",

        borderRadius:6,

        backgroundColor:"#16A34A"

    },


    smallDescription:{

        fontSize:12,

        color:"#64748B",

        marginTop:9

    },


    chartContainer:{

        alignItems:"center",

        overflow:"hidden"

    },


    chart:{

        borderRadius:16,

        marginLeft:-8

    },


    monthStats:{

        flexDirection:"row",

        marginTop:18

    },


    miniStat:{

        flex:1,

        alignItems:"center",

        paddingHorizontal:4

    },


    miniValue:{

        fontSize:20,

        fontWeight:"800",

        color:"#14532D"

    },


    miniLabel:{

        marginTop:5,

        fontSize:10,

        color:"#64748B",

        textAlign:"center"

    },


    bestCard:{

        marginTop:12,

        borderRadius:20,

        padding:18,

        backgroundColor:"#F0FDF4",

        borderWidth:1,

        borderColor:"#BBF7D0",

        flexDirection:"row",

        justifyContent:
            "space-between",

        alignItems:"center"

    },


    bestLabel:{

        fontSize:16,

        fontWeight:"800",

        color:"#166534"

    },


    bestDate:{

        marginTop:5,

        color:"#64748B",

        fontSize:12

    },


    bestRate:{

        fontSize:27,

        fontWeight:"900",

        color:"#16A34A"

    },


    performanceSection:{

        marginTop:24

    },


    habitCard:{

        backgroundColor:"#FFFFFF",

        borderRadius:18,

        padding:16,

        marginTop:11,

        borderWidth:1,

        borderColor:"#E2E8F0"

    },


    habitHeader:{

        flexDirection:"row",

        justifyContent:
            "space-between",

        alignItems:"center",

        marginBottom:12

    },


    habitTitleWrapper:{

        flex:1,

        flexDirection:"row",

        alignItems:"center",

        marginRight:12

    },


    habitIcon:{

        fontSize:21,

        marginRight:9

    },


    habitTitle:{

        fontSize:15,

        fontWeight:"800",

        color:"#0F172A"

    },


    habitMeta:{

        fontSize:11,

        color:"#64748B",

        marginTop:3

    },


    habitRate:{

        fontSize:18,

        fontWeight:"800",

        color:"#16A34A"

    },


    lastCompleted:{

        marginTop:9,

        fontSize:11,

        color:"#64748B"

    },


    emptyCard:{

        backgroundColor:"#FFFFFF",

        borderRadius:18,

        marginTop:12,

        padding:25,

        borderWidth:1,

        borderColor:"#E2E8F0",

        alignItems:"center"

    },


    emptyText:{

        fontSize:13,

        color:"#64748B",

        textAlign:"center"

    },


    errorText:{

        color:"#B91C1C",

        fontSize:15,

        textAlign:"center",

        marginBottom:15

    },


    retryButton:{

        backgroundColor:"#16A34A",

        paddingHorizontal:20,

        paddingVertical:11,

        borderRadius:12

    },


    retryText:{

        color:"#FFFFFF",

        fontWeight:"700"

    }


});