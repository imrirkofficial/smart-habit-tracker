import React, {
    useCallback,
    useState
} from "react";


import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Alert,
    Platform
} from "react-native";


import {
    useFocusEffect
} from "@react-navigation/native";


import api
from "../api/api";


import i18n
from "../localization/i18n";





export default function AchievementScreen(){


    const [achievements,setAchievements] =
        useState([]);


    const [summary,setSummary] =
        useState({

            total:0,

            unlocked:0,

            locked:0

        });


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
    | Text
    |--------------------------------------------------------------------------
    */


    const words = {

        title:isBangla
            ? "অর্জনসমূহ"
            : "Achievements",


        subtitle:isBangla
            ? "আপনার habit journey-এর milestones"
            : "Milestones from your habit journey",


        unlocked:isBangla
            ? "আনলক"
            : "Unlocked",


        locked:isBangla
            ? "লকড"
            : "Locked",


        progress:isBangla
            ? "অগ্রগতি"
            : "Progress",


        reward:isBangla
            ? "পুরস্কার"
            : "Reward",


        noAchievements:isBangla
            ? "এখনও কোনো achievement নেই।"
            : "No achievements available yet.",


        error:isBangla
            ? "Achievements load করা যায়নি।"
            : "Could not load achievements.",


        retry:isBangla
            ? "আবার চেষ্টা করুন"
            : "Try Again",


        congratulations:isBangla
            ? "অভিনন্দন! 🏆"
            : "Congratulations! 🏆"

    };





    /*
    |--------------------------------------------------------------------------
    | Load Achievements
    |--------------------------------------------------------------------------
    */


    const loadAchievements =
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
                            "/achievements"
                        );


                    const data =
                        response.data;


                    const items =
                        Array.isArray(data)

                        ? data

                        : (
                            data
                                ?.achievements
                            || []
                        );


                    setAchievements(
                        items
                    );


                    setSummary({

                        total:
                            data?.total
                            ?? items.length,

                        unlocked:
                            data?.unlocked
                            ??
                            items.filter(
                                item =>
                                    item.unlocked
                            ).length,

                        locked:
                            data?.locked
                            ??
                            items.filter(
                                item =>
                                    !item.unlocked
                            ).length

                    });


                    /*
                    |--------------------------------------------------------------------------
                    | Newly Unlocked Popup
                    |--------------------------------------------------------------------------
                    */


                    const newlyUnlocked =
                        data
                            ?.newly_unlocked
                        || [];


                    if(
                        newlyUnlocked.length
                        > 0
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

                            words
                                .congratulations,

                            `${
                                achievement.badge
                                || "🏆"
                            } ${
                                achievementTitle
                            }\n\n+${
                                achievement.reward_xp
                                || 0
                            } XP  •  +${
                                achievement.reward_coins
                                || 0
                            } Coins`

                        );

                    }


                }

                catch(error){


                    console.log(
                        "ACHIEVEMENT ERROR:",
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
                isBangla
            ]
        );





    /*
    |--------------------------------------------------------------------------
    | Load Whenever Tab Focuses
    |--------------------------------------------------------------------------
    */


    useFocusEffect(

        useCallback(()=>{


            loadAchievements();


        },[
            loadAchievements
        ])

    );





    /*
    |--------------------------------------------------------------------------
    | Refresh
    |--------------------------------------------------------------------------
    */


    const refresh =
        ()=>{


            setRefreshing(true);


            loadAchievements(
                false
            );


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
        achievements.length === 0
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

                    style={styles.retryButton}

                    onPress={
                        ()=>loadAchievements()
                    }

                >


                    <Text
                        style={styles.retryText}
                    >

                        {words.retry}

                    </Text>


                </TouchableOpacity>


            </View>


        );


    }





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

                    🏆 {words.title}

                </Text>


                <Text
                    style={styles.subtitle}
                >

                    {words.subtitle}

                </Text>


            </View>





            {/* Achievement Summary */}


            <View
                style={styles.summaryCard}
            >


                <SummaryItem

                    value={
                        summary.unlocked
                    }

                    label={
                        words.unlocked
                    }

                    icon="🏆"

                />


                <View
                    style={
                        styles.summaryDivider
                    }
                />


                <SummaryItem

                    value={
                        summary.total
                    }

                    label="Total"

                    icon="🎯"

                />


                <View
                    style={
                        styles.summaryDivider
                    }
                />


                <SummaryItem

                    value={
                        summary.locked
                    }

                    label={
                        words.locked
                    }

                    icon="🔒"

                />


            </View>





            {/* Achievement List */}


            {
                achievements.length === 0

                ?


                <View
                    style={styles.emptyCard}
                >


                    <Text
                        style={styles.emptyIcon}
                    >

                        🏆

                    </Text>


                    <Text
                        style={styles.emptyText}
                    >

                        {
                            words
                                .noAchievements
                        }

                    </Text>


                </View>


                :


                achievements.map(
                    achievement=>(


                        <AchievementCard

                            key={
                                achievement.code
                                ||
                                achievement.id
                            }

                            achievement={
                                achievement
                            }

                            isBangla={
                                isBangla
                            }

                            words={
                                words
                            }

                        />


                    )
                )
            }



        </ScrollView>


    );


}





/*
|--------------------------------------------------------------------------
| Summary Item
|--------------------------------------------------------------------------
*/


function SummaryItem({
    icon,
    value,
    label
}){


    return(


        <View
            style={styles.summaryItem}
        >


            <Text
                style={styles.summaryIcon}
            >

                {icon}

            </Text>


            <Text
                style={styles.summaryValue}
            >

                {value}

            </Text>


            <Text
                style={styles.summaryLabel}
            >

                {label}

            </Text>


        </View>


    );


}





/*
|--------------------------------------------------------------------------
| Achievement Card
|--------------------------------------------------------------------------
*/


function AchievementCard({
    achievement,
    isBangla,
    words
}){


    const unlocked =
        Boolean(
            achievement.unlocked
        );


    const title =
        isBangla

        ? (
            achievement.title_bn
            ||
            achievement.title
        )

        : achievement.title;


    const description =
        isBangla

        ? (
            achievement.description_bn
            ||
            achievement.description
        )

        : achievement.description;


    const progress =
        Math.max(

            0,

            Math.min(

                100,

                Number(
                    achievement.progress
                )
                || 0

            )

        );



    return(


        <View

            style={[

                styles.achievementCard,

                unlocked
                    ?
                    styles.unlockedCard
                    :
                    styles.lockedCard

            ]}

        >



            <View
                style={styles.cardHeader}
            >


                <View

                    style={[

                        styles.badgeCircle,

                        !unlocked
                        &&
                        styles.lockedBadge

                    ]}

                >


                    <Text
                        style={styles.badge}
                    >

                        {
                            unlocked
                            ?
                            (
                                achievement.badge
                                ||
                                "🏆"
                            )
                            :
                            "🔒"
                        }

                    </Text>


                </View>




                <View
                    style={styles.cardTitleArea}
                >


                    <Text
                        style={styles.cardTitle}
                    >

                        {title}

                    </Text>


                    <Text
                        style={styles.description}
                    >

                        {description}

                    </Text>


                </View>




                <View

                    style={[

                        styles.statusBadge,

                        unlocked
                            ?
                            styles.unlockedStatus
                            :
                            styles.lockedStatus

                    ]}

                >


                    <Text

                        style={[

                            styles.statusText,

                            unlocked
                                ?
                                styles.unlockedText
                                :
                                styles.lockedText

                        ]}

                    >

                        {
                            unlocked
                            ?
                            words.unlocked
                            :
                            words.locked
                        }

                    </Text>


                </View>


            </View>





            {/* Progress */}


            <View
                style={styles.progressHeader}
            >


                <Text
                    style={styles.progressLabel}
                >

                    {words.progress}

                </Text>


                <Text
                    style={styles.progressValue}
                >

                    {
                        achievement.current
                        ?? 0
                    }

                    {" / "}

                    {
                        achievement.target
                        ?? 0
                    }

                </Text>


            </View>




            <View
                style={styles.progressBackground}
            >


                <View

                    style={[

                        styles.progressFill,

                        {
                            width:
                                `${progress}%`
                        },

                        unlocked
                            ?
                            styles.unlockedProgress
                            :
                            styles.lockedProgress

                    ]}

                />


            </View>





            {/* Rewards */}


            <View
                style={styles.rewardRow}
            >


                <Text
                    style={styles.rewardLabel}
                >

                    🎁 {words.reward}

                </Text>


                <View
                    style={styles.rewardChips}
                >


                    <View
                        style={styles.rewardChip}
                    >


                        <Text
                            style={styles.rewardText}
                        >

                            +{
                                achievement.reward_xp
                                ?? 0
                            } XP

                        </Text>


                    </View>


                    <View
                        style={styles.rewardChip}
                    >


                        <Text
                            style={styles.rewardText}
                        >

                            🪙 +{
                                achievement.reward_coins
                                ?? 0
                            }

                        </Text>


                    </View>


                </View>


            </View>



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

        width:"100%",

        maxWidth:900,

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

        justifyContent:"center",

        alignItems:"center",

        backgroundColor:"#F8FAFC",

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

        marginTop:5,

        fontSize:14,

        color:"#64748B"

    },


    summaryCard:{

        flexDirection:"row",

        backgroundColor:"#14532D",

        borderRadius:22,

        paddingVertical:18,

        marginBottom:18

    },


    summaryItem:{

        flex:1,

        alignItems:"center"

    },


    summaryIcon:{

        fontSize:20,

        marginBottom:4

    },


    summaryValue:{

        fontSize:24,

        fontWeight:"900",

        color:"#FFFFFF"

    },


    summaryLabel:{

        fontSize:11,

        marginTop:3,

        color:"#BBF7D0"

    },


    summaryDivider:{

        width:1,

        backgroundColor:"#3F7651"

    },


    achievementCard:{

        borderRadius:20,

        padding:17,

        marginBottom:13,

        borderWidth:1

    },


    unlockedCard:{

        backgroundColor:"#FFFFFF",

        borderColor:"#BBF7D0"

    },


    lockedCard:{

        backgroundColor:"#F8FAFC",

        borderColor:"#E2E8F0"

    },


    cardHeader:{

        flexDirection:"row",

        alignItems:"center"

    },


    badgeCircle:{

        width:54,

        height:54,

        borderRadius:27,

        backgroundColor:"#DCFCE7",

        justifyContent:"center",

        alignItems:"center",

        marginRight:12

    },


    lockedBadge:{

        backgroundColor:"#E2E8F0"

    },


    badge:{

        fontSize:27

    },


    cardTitleArea:{

        flex:1,

        marginRight:8

    },


    cardTitle:{

        fontSize:16,

        fontWeight:"800",

        color:"#0F172A"

    },


    description:{

        fontSize:12,

        lineHeight:17,

        marginTop:4,

        color:"#64748B"

    },


    statusBadge:{

        paddingHorizontal:9,

        paddingVertical:5,

        borderRadius:12

    },


    unlockedStatus:{

        backgroundColor:"#DCFCE7"

    },


    lockedStatus:{

        backgroundColor:"#E2E8F0"

    },


    statusText:{

        fontSize:10,

        fontWeight:"800"

    },


    unlockedText:{

        color:"#15803D"

    },


    lockedText:{

        color:"#64748B"

    },


    progressHeader:{

        flexDirection:"row",

        justifyContent:"space-between",

        marginTop:16,

        marginBottom:7

    },


    progressLabel:{

        fontSize:11,

        fontWeight:"700",

        color:"#64748B"

    },


    progressValue:{

        fontSize:11,

        fontWeight:"800",

        color:"#475569"

    },


    progressBackground:{

        height:8,

        borderRadius:5,

        overflow:"hidden",

        backgroundColor:"#E2E8F0"

    },


    progressFill:{

        height:"100%",

        borderRadius:5

    },


    unlockedProgress:{

        backgroundColor:"#16A34A"

    },


    lockedProgress:{

        backgroundColor:"#94A3B8"

    },


    rewardRow:{

        marginTop:14,

        flexDirection:"row",

        justifyContent:"space-between",

        alignItems:"center"

    },


    rewardLabel:{

        fontSize:11,

        color:"#64748B",

        fontWeight:"700"

    },


    rewardChips:{

        flexDirection:"row"

    },


    rewardChip:{

        backgroundColor:"#F0FDF4",

        paddingHorizontal:9,

        paddingVertical:5,

        borderRadius:10,

        marginLeft:5

    },


    rewardText:{

        fontSize:10,

        fontWeight:"800",

        color:"#166534"

    },


    emptyCard:{

        backgroundColor:"#FFFFFF",

        borderRadius:20,

        padding:30,

        alignItems:"center",

        borderWidth:1,

        borderColor:"#E2E8F0"

    },


    emptyIcon:{

        fontSize:40,

        marginBottom:10

    },


    emptyText:{

        color:"#64748B",

        fontSize:13,

        textAlign:"center"

    },


    errorText:{

        color:"#B91C1C",

        fontSize:14,

        textAlign:"center",

        marginBottom:15

    },


    retryButton:{

        paddingHorizontal:20,

        paddingVertical:11,

        borderRadius:12,

        backgroundColor:"#16A34A"

    },


    retryText:{

        color:"#FFFFFF",

        fontWeight:"700"

    }


});