import React, {
    useEffect,
    useMemo,
    useState
} from "react";


import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Platform
} from "react-native";


import api from "../api/api";


import i18n
from "../localization/i18n";





const getCurrentMonthKey = ()=>{


    const now =
        new Date();


    return (
        now.getFullYear()
        +
        "-"
        +
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        )
    );


};





const formatMonthKey =
(date)=>{


    return (
        date.getFullYear()
        +
        "-"
        +
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        )
    );


};





export default function CalendarScreen(){


    const [month,setMonth] =
        useState(
            getCurrentMonthKey()
        );


    const [calendar,setCalendar] =
        useState(null);


    const [loading,setLoading] =
        useState(true);


    const [refreshing,setRefreshing] =
        useState(false);


    const [error,setError] =
        useState("");


    const [selectedDay,setSelectedDay] =
        useState(null);



    const isBangla =
        String(
            i18n.locale || ""
        )
        .toLowerCase()
        .startsWith("bn");





    /*
    |--------------------------------------------------------------------------
    | Language Text
    |--------------------------------------------------------------------------
    */


    const words = {

        title:isBangla
            ? "অভ্যাস ক্যালেন্ডার"
            : "Habit Calendar",


        monthlyProgress:isBangla
            ? "মাসিক অগ্রগতি"
            : "Monthly Progress",


        completionRate:isBangla
            ? "সম্পন্নের হার"
            : "Completion Rate",


        completedDays:isBangla
            ? "সম্পূর্ণ দিন"
            : "Completed Days",


        missedDays:isBangla
            ? "মিসড দিন"
            : "Missed Days",


        completed:isBangla
            ? "সম্পন্ন"
            : "Completed",


        partial:isBangla
            ? "আংশিক"
            : "Partial",


        missed:isBangla
            ? "মিসড"
            : "Missed",


        pending:isBangla
            ? "আজ বাকি"
            : "Pending Today",


        future:isBangla
            ? "ভবিষ্যৎ"
            : "Future",


        noHabits:isBangla
            ? "কোনো habit ছিল না"
            : "No Habits",


        habits:isBangla
            ? "হ্যাবিট"
            : "habits",


        bestDay:isBangla
            ? "সেরা দিন"
            : "Best Day",


        tryAgain:isBangla
            ? "আবার চেষ্টা করুন"
            : "Try Again",


        loadError:isBangla
            ? "Calendar data load করা যায়নি।"
            : "Could not load calendar data.",


        today:isBangla
            ? "আজ"
            : "Today"

    };





    /*
    |--------------------------------------------------------------------------
    | Month Names
    |--------------------------------------------------------------------------
    */


    const englishMonths = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];


    const banglaMonths = [

        "জানুয়ারি",
        "ফেব্রুয়ারি",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর"

    ];





    const weekdays =
        isBangla

        ? [
            "সোম",
            "মঙ্গল",
            "বুধ",
            "বৃহ",
            "শুক্র",
            "শনি",
            "রবি"
        ]

        : [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ];





    /*
    |--------------------------------------------------------------------------
    | Month Label
    |--------------------------------------------------------------------------
    */


    const monthLabel =
        useMemo(()=>{


            const [
                year,
                monthNumber
            ] =
                month
                    .split("-")
                    .map(Number);


            const names =
                isBangla
                    ? banglaMonths
                    : englishMonths;


            return (
                names[
                    monthNumber - 1
                ]
                +
                " "
                +
                year
            );


        },[
            month,
            isBangla
        ]);





    /*
    |--------------------------------------------------------------------------
    | Load Calendar
    |--------------------------------------------------------------------------
    */


    const loadCalendar =
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
                        "/calendar",
                        {
                            params:{
                                month:month
                            }
                        }
                    );


                setCalendar(
                    response.data
                );


                /*
                Select today if visible.
                */


                const today =
                    response
                        ?.data
                        ?.days
                        ?.find(
                            item =>
                                item.is_today
                        );


                if(today){

                    setSelectedDay(
                        today
                    );

                }

                else{

                    setSelectedDay(
                        null
                    );

                }


            }

            catch(error){


                console.log(
                    "CALENDAR ERROR:",
                    error?.response?.data
                    ||
                    error?.message
                    ||
                    error
                );


                setError(
                    words.loadError
                );


            }

            finally{


                setLoading(false);

                setRefreshing(false);


            }


        };





    useEffect(()=>{


        loadCalendar();


    },[
        month
    ]);





    /*
    |--------------------------------------------------------------------------
    | Refresh
    |--------------------------------------------------------------------------
    */


    const refresh =
        ()=>{


            setRefreshing(true);


            loadCalendar(
                false
            );


        };





    /*
    |--------------------------------------------------------------------------
    | Previous / Next Month
    |--------------------------------------------------------------------------
    */


    const changeMonth =
        offset=>{


            const [
                year,
                monthNumber
            ] =
                month
                    .split("-")
                    .map(Number);


            const date =
                new Date(
                    year,
                    monthNumber - 1,
                    1
                );


            date.setMonth(
                date.getMonth()
                +
                offset
            );


            setMonth(
                formatMonthKey(
                    date
                )
            );


        };





    /*
    |--------------------------------------------------------------------------
    | Calendar Grid
    |--------------------------------------------------------------------------
    */


    const calendarCells =
        useMemo(()=>{


            if(
                !calendar?.days
            ){

                return [];

            }


            const blanks =
                Math.max(
                    0,
                    (
                        calendar.first_weekday
                        || 1
                    )
                    - 1
                );


            const placeholders =
                Array
                    .from(
                        {
                            length:blanks
                        },
                        (_,index)=>({

                            placeholder:true,

                            key:
                                `blank-${index}`

                        })
                    );


            return [
                ...placeholders,
                ...calendar.days
            ];


        },[
            calendar
        ]);





    /*
    |--------------------------------------------------------------------------
    | Day Style
    |--------------------------------------------------------------------------
    */


    const getDayBackground =
        item=>{


            if(item.status === "completed"){

                return "#22C55E";

            }


            if(item.status === "missed"){

                return "#FEE2E2";

            }


            if(item.status === "pending"){

                return "#FEF3C7";

            }


            if(
                item.status === "future"
                ||
                item.status === "no_habits"
            ){

                return "#F1F5F9";

            }



            /*
            Partial completion heatmap
            */


            switch(item.intensity){


                case 3:
                    return "#86EFAC";


                case 2:
                    return "#BBF7D0";


                case 1:
                    return "#DCFCE7";


                default:
                    return "#F1F5F9";

            }


        };





    const getStatusText =
        item=>{


            switch(
                item.status
            ){


                case "completed":
                    return words.completed;


                case "partial":
                    return words.partial;


                case "missed":
                    return words.missed;


                case "pending":
                    return words.pending;


                case "future":
                    return words.future;


                case "no_habits":
                    return words.noHabits;


                default:
                    return "";

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
                style={styles.center}
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
        !calendar
    ){


        return(


            <View
                style={styles.center}
            >


                <Text
                    style={styles.errorText}
                >

                    {error}

                </Text>


                <TouchableOpacity

                    style={
                        styles.retryButton
                    }

                    onPress={
                        ()=>loadCalendar()
                    }

                >


                    <Text
                        style={
                            styles.retryText
                        }
                    >

                        {words.tryAgain}

                    </Text>


                </TouchableOpacity>


            </View>


        );


    }





    const summary =
        calendar?.summary
        || {};





    return(


        <ScrollView

            style={styles.container}

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
                style={styles.header}
            >


                <Text
                    style={styles.title}
                >

                    📅 {words.title}

                </Text>


                <Text
                    style={styles.subtitle}
                >

                    {
                        words.monthlyProgress
                    }

                </Text>


            </View>





            {/* Month Navigation */}


            <View
                style={
                    styles.monthNavigation
                }
            >


                <TouchableOpacity

                    style={
                        styles.monthButton
                    }

                    onPress={
                        ()=>changeMonth(-1)
                    }

                >


                    <Text
                        style={
                            styles.monthArrow
                        }
                    >

                        ‹

                    </Text>


                </TouchableOpacity>




                <Text
                    style={
                        styles.monthTitle
                    }
                >

                    {monthLabel}

                </Text>




                <TouchableOpacity

                    style={
                        styles.monthButton
                    }

                    onPress={
                        ()=>changeMonth(1)
                    }

                >


                    <Text
                        style={
                            styles.monthArrow
                        }
                    >

                        ›

                    </Text>


                </TouchableOpacity>


            </View>





            {/* Statistics */}


            <View
                style={styles.statsRow}
            >


                <View
                    style={styles.statCard}
                >


                    <Text
                        style={styles.statValue}
                    >

                        {
                            summary
                                .completion_rate
                            ?? 0
                        }%

                    </Text>


                    <Text
                        style={styles.statLabel}
                    >

                        {
                            words
                                .completionRate
                        }

                    </Text>


                </View>




                <View
                    style={styles.statCard}
                >


                    <Text
                        style={styles.statValue}
                    >

                        {
                            summary
                                .completed_days
                            ?? 0
                        }

                    </Text>


                    <Text
                        style={styles.statLabel}
                    >

                        {
                            words
                                .completedDays
                        }

                    </Text>


                </View>




                <View
                    style={styles.statCard}
                >


                    <Text
                        style={styles.statValue}
                    >

                        {
                            summary
                                .missed_days
                            ?? 0
                        }

                    </Text>


                    <Text
                        style={styles.statLabel}
                    >

                        {
                            words
                                .missedDays
                        }

                    </Text>


                </View>


            </View>





            {/* Calendar */}


            <View
                style={styles.calendarCard}
            >


                <View
                    style={styles.weekRow}
                >


                    {
                        weekdays.map(
                            day=>(


                                <View

                                    key={day}

                                    style={
                                        styles.weekCell
                                    }

                                >


                                    <Text
                                        style={
                                            styles.weekText
                                        }
                                    >

                                        {day}

                                    </Text>


                                </View>


                            )
                        )
                    }


                </View>




                <View
                    style={styles.grid}
                >


                    {
                        calendarCells.map(
                            (
                                item,
                                index
                            )=>{


                                if(
                                    item.placeholder
                                ){


                                    return(


                                        <View

                                            key={
                                                item.key
                                            }

                                            style={
                                                styles.daySlot
                                            }

                                        />


                                    );


                                }



                                const selected =
                                    selectedDay
                                    ?.date
                                    ===
                                    item.date;


                                const darkText =
                                    item.status
                                    !==
                                    "completed";



                                return(


                                    <View

                                        key={
                                            item.date
                                        }

                                        style={
                                            styles.daySlot
                                        }

                                    >


                                        <TouchableOpacity

                                            activeOpacity={
                                                0.75
                                            }

                                            onPress={
                                                ()=>setSelectedDay(
                                                    item
                                                )
                                            }

                                            style={[

                                                styles.dayCell,

                                                {
                                                    backgroundColor:
                                                        getDayBackground(
                                                            item
                                                        )
                                                },

                                                item.is_today
                                                &&
                                                styles.todayCell,

                                                selected
                                                &&
                                                styles.selectedCell

                                            ]}

                                        >


                                            <Text

                                                style={[

                                                    styles.dayNumber,

                                                    {
                                                        color:
                                                            darkText
                                                            ?
                                                            "#334155"
                                                            :
                                                            "#FFFFFF"
                                                    }

                                                ]}

                                            >

                                                {item.day}

                                            </Text>



                                            {
                                                item.completed_count
                                                > 0
                                                &&

                                                <Text

                                                    style={[

                                                        styles.smallCount,

                                                        {
                                                            color:
                                                                darkText
                                                                ?
                                                                "#15803D"
                                                                :
                                                                "#FFFFFF"
                                                        }

                                                    ]}

                                                >

                                                    {
                                                        item
                                                            .completed_count
                                                    }

                                                </Text>
                                            }


                                        </TouchableOpacity>


                                    </View>


                                );


                            }
                        )
                    }


                </View>


            </View>





            {/* Legend */}


            <View
                style={styles.legend}
            >


                <LegendItem
                    color="#22C55E"
                    label={words.completed}
                />


                <LegendItem
                    color="#BBF7D0"
                    label={words.partial}
                />


                <LegendItem
                    color="#FEE2E2"
                    label={words.missed}
                />


                <LegendItem
                    color="#FEF3C7"
                    label={words.today}
                />


            </View>





            {/* Selected Day Details */}


            {
                selectedDay
                &&

                <View
                    style={
                        styles.detailCard
                    }
                >


                    <Text
                        style={
                            styles.detailTitle
                        }
                    >

                        {
                            selectedDay.date
                        }

                        {
                            selectedDay.is_today
                            ?
                            ` • ${words.today}`
                            :
                            ""
                        }

                    </Text>




                    <View
                        style={
                            styles.detailRow
                        }
                    >


                        <Text
                            style={
                                styles.detailLabel
                            }
                        >

                            {
                                getStatusText(
                                    selectedDay
                                )
                            }

                        </Text>


                        <Text
                            style={
                                styles.detailRate
                            }
                        >

                            {
                                selectedDay
                                    .completion_rate
                            }%

                        </Text>


                    </View>




                    <Text
                        style={
                            styles.detailDescription
                        }
                    >

                        {
                            selectedDay
                                .completed_count
                        }

                        {" / "}

                        {
                            selectedDay
                                .total_habits
                        }

                        {" "}

                        {words.habits}

                    </Text>


                </View>

            }





            {/* Best Day */}


            {
                summary.best_day
                &&

                <View
                    style={
                        styles.bestCard
                    }
                >


                    <Text
                        style={
                            styles.bestTitle
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
                            summary
                                .best_day
                                .date
                        }

                    </Text>


                    <Text
                        style={
                            styles.bestRate
                        }
                    >

                        {
                            summary
                                .best_day
                                .completion_rate
                        }%

                    </Text>


                </View>

            }



        </ScrollView>


    );


}





function LegendItem({
    color,
    label
}){


    return(


        <View
            style={styles.legendItem}
        >


            <View

                style={[
                    styles.legendColor,
                    {
                        backgroundColor:
                            color
                    }
                ]}

            />


            <Text
                style={styles.legendText}
            >

                {label}

            </Text>


        </View>


    );


}





const styles =
StyleSheet.create({


    container:{

        flex:1,

        backgroundColor:"#F8FAFC"

    },


    content:{

        paddingHorizontal:16,

        paddingTop:
            Platform.OS === "ios"
            ? 55
            : 38,

        paddingBottom:120

    },


    center:{

        flex:1,

        justifyContent:"center",

        alignItems:"center",

        backgroundColor:"#F8FAFC",

        padding:20

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


    monthNavigation:{

        flexDirection:"row",

        alignItems:"center",

        justifyContent:"space-between",

        marginBottom:18

    },


    monthButton:{

        width:44,

        height:44,

        borderRadius:22,

        backgroundColor:"#FFFFFF",

        justifyContent:"center",

        alignItems:"center",

        borderWidth:1,

        borderColor:"#E2E8F0"

    },


    monthArrow:{

        fontSize:30,

        lineHeight:34,

        color:"#16A34A",

        fontWeight:"700"

    },


    monthTitle:{

        fontSize:19,

        fontWeight:"800",

        color:"#0F172A"

    },


    statsRow:{

        flexDirection:"row",

        marginHorizontal:-4,

        marginBottom:18

    },


    statCard:{

        flex:1,

        backgroundColor:"#FFFFFF",

        borderRadius:16,

        paddingVertical:16,

        paddingHorizontal:8,

        marginHorizontal:4,

        alignItems:"center",

        borderWidth:1,

        borderColor:"#E2E8F0"

    },


    statValue:{

        fontSize:22,

        fontWeight:"800",

        color:"#16A34A"

    },


    statLabel:{

        marginTop:5,

        fontSize:11,

        color:"#64748B",

        textAlign:"center"

    },


    calendarCard:{

        backgroundColor:"#FFFFFF",

        borderRadius:20,

        padding:12,

        borderWidth:1,

        borderColor:"#E2E8F0"

    },


    weekRow:{

        flexDirection:"row",

        marginBottom:7

    },


    weekCell:{

        width:"14.2857%",

        alignItems:"center"

    },


    weekText:{

        fontSize:11,

        fontWeight:"700",

        color:"#64748B"

    },


    grid:{

        flexDirection:"row",

        flexWrap:"wrap"

    },


    daySlot:{

        width:"14.2857%",

        padding:3

    },


    dayCell:{

        width:"100%",

        aspectRatio:1,

        borderRadius:10,

        justifyContent:"center",

        alignItems:"center",

        borderWidth:1,

        borderColor:"transparent"

    },


    todayCell:{

        borderWidth:2,

        borderColor:"#F59E0B"

    },


    selectedCell:{

        borderWidth:2,

        borderColor:"#166534"

    },


    dayNumber:{

        fontSize:14,

        fontWeight:"700"

    },


    smallCount:{

        fontSize:9,

        fontWeight:"700",

        marginTop:1

    },


    legend:{

        flexDirection:"row",

        flexWrap:"wrap",

        marginTop:16,

        marginBottom:8

    },


    legendItem:{

        flexDirection:"row",

        alignItems:"center",

        marginRight:15,

        marginBottom:8

    },


    legendColor:{

        width:12,

        height:12,

        borderRadius:3,

        marginRight:5

    },


    legendText:{

        fontSize:12,

        color:"#64748B"

    },


    detailCard:{

        backgroundColor:"#FFFFFF",

        borderRadius:18,

        padding:17,

        marginTop:14,

        borderWidth:1,

        borderColor:"#E2E8F0"

    },


    detailTitle:{

        fontSize:17,

        fontWeight:"800",

        color:"#0F172A",

        marginBottom:10

    },


    detailRow:{

        flexDirection:"row",

        justifyContent:"space-between",

        alignItems:"center"

    },


    detailLabel:{

        fontSize:14,

        fontWeight:"700",

        color:"#475569"

    },


    detailRate:{

        fontSize:23,

        fontWeight:"800",

        color:"#16A34A"

    },


    detailDescription:{

        marginTop:8,

        fontSize:13,

        color:"#64748B"

    },


    bestCard:{

        backgroundColor:"#F0FDF4",

        borderRadius:18,

        padding:17,

        marginTop:14,

        borderWidth:1,

        borderColor:"#BBF7D0"

    },


    bestTitle:{

        color:"#166534",

        fontWeight:"800",

        fontSize:16

    },


    bestDate:{

        marginTop:7,

        color:"#475569",

        fontSize:13

    },


    bestRate:{

        marginTop:4,

        color:"#16A34A",

        fontSize:24,

        fontWeight:"800"

    },


    errorText:{

        color:"#B91C1C",

        fontSize:15,

        textAlign:"center",

        marginBottom:15

    },


    retryButton:{

        backgroundColor:"#16A34A",

        borderRadius:12,

        paddingHorizontal:20,

        paddingVertical:11

    },


    retryText:{

        color:"#FFFFFF",

        fontWeight:"700"

    }


});