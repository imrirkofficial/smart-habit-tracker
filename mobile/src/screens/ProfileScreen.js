import React, {
    useCallback,
    useState
} from "react";


import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Platform
} from "react-native";


import {
    useFocusEffect
} from "@react-navigation/native";


import api
from "../api/api";


import {
    removeToken
} from "../storage/token";


import {
    saveLanguage
} from "../storage/language";


import i18n
from "../localization/i18n";





export default function ProfileScreen({
    navigation
}){


    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */


    const [profile,setProfile] =
        useState({});


    const [analytics,setAnalytics] =
        useState({});


    const [achievementSummary,setAchievementSummary] =
        useState({

            total:0,

            unlocked:0,

            locked:0

        });


    const [loading,setLoading] =
        useState(true);


    const [refreshing,setRefreshing] =
        useState(false);


    const [changingLanguage,setChangingLanguage] =
        useState(false);


    /*
    This state forces the screen
    to re-render when language changes.
    */


    const [locale,setLocale] =
        useState(
            i18n.locale || "en"
        );





    /*
    |--------------------------------------------------------------------------
    | Language
    |--------------------------------------------------------------------------
    */


    const isBangla =
        String(locale)
            .toLowerCase()
            .startsWith("bn");



    const words = {

        profile:isBangla
            ? "প্রোফাইল"
            : "Profile",


        subtitle:isBangla
            ? "আপনার habit journey এক নজরে"
            : "Your habit journey at a glance",


        level:isBangla
            ? "লেভেল"
            : "Level",


        xp:isBangla
            ? "XP"
            : "XP",


        coins:isBangla
            ? "কয়েন"
            : "Coins",


        currentStreak:isBangla
            ? "বর্তমান স্ট্রিক"
            : "Current Streak",


        longestStreak:isBangla
            ? "সর্বোচ্চ স্ট্রিক"
            : "Longest Streak",


        totalHabits:isBangla
            ? "মোট অভ্যাস"
            : "Total Habits",


        completedHabits:isBangla
            ? "মোট কমপ্লিশন"
            : "Total Completions",


        achievements:isBangla
            ? "অর্জন"
            : "Achievements",


        unlocked:isBangla
            ? "আনলক"
            : "Unlocked",


        language:isBangla
            ? "ভাষা"
            : "Language",


        settings:isBangla
            ? "সেটিংস"
            : "Settings",


        account:isBangla
            ? "অ্যাকাউন্ট"
            : "Account",


        logout:isBangla
            ? "লগআউট"
            : "Logout",


        logoutTitle:isBangla
            ? "লগআউট করবেন?"
            : "Logout?",


        logoutMessage:isBangla
            ? "আপনি কি নিশ্চিতভাবে লগআউট করতে চান?"
            : "Are you sure you want to logout?",


        cancel:isBangla
            ? "বাতিল"
            : "Cancel",


        error:isBangla
            ? "ত্রুটি"
            : "Error",


        loadError:isBangla
            ? "Profile data load করা যায়নি।"
            : "Could not load profile data.",


        retry:isBangla
            ? "আবার চেষ্টা করুন"
            : "Try Again",


        progress:isBangla
            ? "পরবর্তী লেভেলের অগ্রগতি"
            : "Progress to Next Level",


        settingsSoon:isBangla
            ? "Settings screen পরবর্তী ধাপে যুক্ত করা হবে।"
            : "The Settings screen will be added in the next phase.",


        viewAchievements:isBangla
            ? "অর্জনগুলো দেখুন"
            : "View Achievements"

    };





    /*
    |--------------------------------------------------------------------------
    | Load Profile Data
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


                    const [

                        profileResponse,

                        analyticsResponse,

                        achievementsResponse

                    ] =
                        await Promise.all([

                            api.get(
                                "/profile"
                            ),

                            api.get(
                                "/analytics"
                            ),

                            api.get(
                                "/achievements"
                            )

                        ]);



                    setProfile(
                        profileResponse.data
                        || {}
                    );



                    setAnalytics(
                        analyticsResponse.data
                        || {}
                    );



                    const achievementData =
                        achievementsResponse.data;



                    if(
                        Array.isArray(
                            achievementData
                        )
                    ){

                        setAchievementSummary({

                            total:
                                achievementData.length,

                            unlocked:
                                achievementData.filter(
                                    item =>
                                        item.unlocked
                                ).length,

                            locked:
                                achievementData.filter(
                                    item =>
                                        !item.unlocked
                                ).length

                        });

                    }
                    else{

                        setAchievementSummary({

                            total:
                                achievementData?.total
                                ?? 0,

                            unlocked:
                                achievementData?.unlocked
                                ?? 0,

                            locked:
                                achievementData?.locked
                                ?? 0

                        });

                    }


                }

                catch(error){


                    console.log(

                        "PROFILE ERROR:",

                        error?.response?.data
                        ||
                        error?.message
                        ||
                        error

                    );


                    Alert.alert(

                        words.error,

                        words.loadError

                    );


                }

                finally{


                    setLoading(false);

                    setRefreshing(false);


                }


            },
            [
                words.error,
                words.loadError
            ]
        );





    /*
    |--------------------------------------------------------------------------
    | Reload On Focus
    |--------------------------------------------------------------------------
    */


    useFocusEffect(

        useCallback(()=>{


            loadData();


        },[
            loadData
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


            loadData(
                false
            );


        };





    /*
    |--------------------------------------------------------------------------
    | Change Language
    |--------------------------------------------------------------------------
    */


    const changeLanguage =
        async(language)=>{


            if(
                changingLanguage
                ||
                locale === language
            ){

                return;

            }


            try{


                setChangingLanguage(
                    true
                );


                /*
                Update i18n
                */


                i18n.locale =
                    language;


                /*
                Persist locally
                */


                await saveLanguage(
                    language
                );


                /*
                Trigger UI refresh
                */


                setLocale(
                    language
                );


            }

            catch(error){


                console.log(

                    "LANGUAGE ERROR:",

                    error

                );


            }

            finally{


                setChangingLanguage(
                    false
                );


            }


        };





    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */


    const performLogout =
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


                console.log(

                    "PROFILE LOGOUT API ERROR:",

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





    const logout =
        ()=>{


            Alert.alert(

                words.logoutTitle,

                words.logoutMessage,

                [

                    {

                        text:
                            words.cancel,

                        style:
                            "cancel"

                    },

                    {

                        text:
                            words.logout,

                        style:
                            "destructive",

                        onPress:
                            performLogout

                    }

                ]

            );


        };





    /*
    |--------------------------------------------------------------------------
    | Profile Calculations
    |--------------------------------------------------------------------------
    */


    const name =
        profile?.name
        || "User";


    const email =
        profile?.email
        || "";


    const level =
        Number(
            analytics?.level
            ??
            profile?.level
            ??
            1
        );


    const xp =
        Number(
            analytics?.xp
            ??
            profile?.xp
            ??
            0
        );


    const coins =
        Number(
            analytics?.coins
            ??
            profile?.coins
            ??
            0
        );


    const currentStreak =
        Number(
            analytics?.current_streak
            ??
            profile?.current_streak
            ??
            0
        );


    const longestStreak =
        Number(
            analytics?.longest_streak
            ??
            profile?.longest_streak
            ??
            0
        );


    /*
    Every 100 XP represents one level.
    Example:
    240 XP = 40 / 100 toward next level.
    */


    const currentLevelXp =
        xp % 100;


    const xpProgress =
        Math.max(

            0,

            Math.min(
                100,
                currentLevelXp
            )

        );


    const avatarLetter =
        name
            .trim()
            .charAt(0)
            .toUpperCase()
        || "U";





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
    | Main UI
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



            {/* Page Header */}


            <View
                style={
                    styles.pageHeader
                }
            >


                <Text
                    style={
                        styles.pageTitle
                    }
                >

                    👤 {words.profile}

                </Text>


                <Text
                    style={
                        styles.pageSubtitle
                    }
                >

                    {words.subtitle}

                </Text>


            </View>





            {/* Main Profile Card */}


            <View
                style={
                    styles.profileCard
                }
            >


                <View
                    style={
                        styles.avatar
                    }
                >


                    <Text
                        style={
                            styles.avatarText
                        }
                    >

                        {avatarLetter}

                    </Text>


                </View>



                <Text
                    style={
                        styles.name
                    }
                >

                    {name}

                </Text>


                <Text
                    style={
                        styles.email
                    }
                >

                    {email}

                </Text>




                <View
                    style={
                        styles.levelBadge
                    }
                >


                    <Text
                        style={
                            styles.levelBadgeText
                        }
                    >

                        ⭐ {words.level} {level}

                    </Text>


                </View>




                <View
                    style={
                        styles.xpHeader
                    }
                >


                    <Text
                        style={
                            styles.xpTitle
                        }
                    >

                        {words.progress}

                    </Text>


                    <Text
                        style={
                            styles.xpValue
                        }
                    >

                        {currentLevelXp} / 100 XP

                    </Text>


                </View>




                <View
                    style={
                        styles.xpBackground
                    }
                >


                    <View

                        style={[

                            styles.xpFill,

                            {
                                width:
                                    `${xpProgress}%`
                            }

                        ]}

                    />


                </View>




                <View
                    style={
                        styles.rewardRow
                    }
                >


                    <View
                        style={
                            styles.rewardItem
                        }
                    >


                        <Text
                            style={
                                styles.rewardIcon
                            }
                        >

                            ⚡

                        </Text>


                        <Text
                            style={
                                styles.rewardValue
                            }
                        >

                            {xp}

                        </Text>


                        <Text
                            style={
                                styles.rewardLabel
                            }
                        >

                            {words.xp}

                        </Text>


                    </View>




                    <View
                        style={
                            styles.rewardDivider
                        }
                    />




                    <View
                        style={
                            styles.rewardItem
                        }
                    >


                        <Text
                            style={
                                styles.rewardIcon
                            }
                        >

                            🪙

                        </Text>


                        <Text
                            style={
                                styles.rewardValue
                            }
                        >

                            {coins}

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





            {/* Streak Cards */}


            <View
                style={
                    styles.twoColumnRow
                }
            >


                <StatBox

                    icon="🔥"

                    value={
                        currentStreak
                    }

                    label={
                        words.currentStreak
                    }

                />


                <StatBox

                    icon="🏆"

                    value={
                        longestStreak
                    }

                    label={
                        words.longestStreak
                    }

                />


            </View>





            {/* Habit Stats */}


            <View
                style={
                    styles.sectionCard
                }
            >


                <Text
                    style={
                        styles.sectionTitle
                    }
                >

                    📊 {
                        isBangla
                        ? "আপনার পরিসংখ্যান"
                        : "Your Statistics"
                    }

                </Text>




                <View
                    style={
                        styles.statsGrid
                    }
                >


                    <ProfileStat

                        icon="🌱"

                        value={
                            analytics
                                ?.total_habits
                            ?? 0
                        }

                        label={
                            words.totalHabits
                        }

                    />


                    <ProfileStat

                        icon="✅"

                        value={
                            analytics
                                ?.completed_habits
                            ?? 0
                        }

                        label={
                            words.completedHabits
                        }

                    />


                    <ProfileStat

                        icon="🏆"

                        value={
                            achievementSummary
                                .unlocked
                        }

                        label={
                            words.achievements
                        }

                    />


                    <ProfileStat

                        icon="📈"

                        value={
                            `${
                                analytics
                                    ?.productivity_score
                                ?? 0
                            }%`
                        }

                        label={
                            isBangla
                            ? "উৎপাদনশীলতা"
                            : "Productivity"
                        }

                    />


                </View>




                <TouchableOpacity

                    style={
                        styles.achievementButton
                    }

                    onPress={()=>{

                        navigation.navigate(
                            "Achievements"
                        );

                    }}

                >


                    <Text
                        style={
                            styles.achievementButtonText
                        }
                    >

                        🏆 {words.viewAchievements}

                    </Text>


                    <Text
                        style={
                            styles.rowArrow
                        }
                    >

                        ›

                    </Text>


                </TouchableOpacity>


            </View>





            {/* Language */}


            <View
                style={
                    styles.sectionCard
                }
            >


                <Text
                    style={
                        styles.sectionTitle
                    }
                >

                    🌐 {words.language}

                </Text>




                <View
                    style={
                        styles.languageRow
                    }
                >


                    <TouchableOpacity

                        style={[

                            styles.languageButton,

                            !isBangla
                            &&
                            styles.languageActive

                        ]}

                        onPress={
                            ()=>changeLanguage(
                                "en"
                            )
                        }

                        disabled={
                            changingLanguage
                        }

                    >


                        <Text

                            style={[

                                styles.languageText,

                                !isBangla
                                &&
                                styles.languageActiveText

                            ]}

                        >

                            English

                        </Text>


                    </TouchableOpacity>




                    <TouchableOpacity

                        style={[

                            styles.languageButton,

                            isBangla
                            &&
                            styles.languageActive

                        ]}

                        onPress={
                            ()=>changeLanguage(
                                "bn"
                            )
                        }

                        disabled={
                            changingLanguage
                        }

                    >


                        <Text

                            style={[

                                styles.languageText,

                                isBangla
                                &&
                                styles.languageActiveText

                            ]}

                        >

                            বাংলা

                        </Text>


                    </TouchableOpacity>


                </View>


            </View>





            {/* Settings Shortcut */}


            <View
                style={
                    styles.sectionCard
                }
            >


                <Text
                    style={
                        styles.sectionTitle
                    }
                >

                    ⚙️ {words.settings}

                </Text>



                <TouchableOpacity

                    style={
                        styles.settingsRow
                    }

                    onPress={()=>{


                        Alert.alert(

                            words.settings,

                            words.settingsSoon

                        );


                    }}

                >


                    <View
                        style={
                            styles.settingsLeft
                        }
                    >


                        <View
                            style={
                                styles.settingsIconBox
                            }
                        >


                            <Text
                                style={
                                    styles.settingsIcon
                                }
                            >

                                ⚙️

                            </Text>


                        </View>


                        <View
                            style={{
                                flex:1
                            }}
                        >


                            <Text
                                style={
                                    styles.settingsTitle
                                }
                            >

                                {words.settings}

                            </Text>


                            <Text
                                style={
                                    styles.settingsDescription
                                }
                            >

                                {
                                    isBangla
                                    ? "Notification, theme এবং account preferences"
                                    : "Notifications, theme and account preferences"
                                }

                            </Text>


                        </View>


                    </View>


                    <Text
                        style={
                            styles.rowArrow
                        }
                    >

                        ›

                    </Text>


                </TouchableOpacity>


            </View>





            {/* Account */}


            <View
                style={
                    styles.sectionCard
                }
            >


                <Text
                    style={
                        styles.sectionTitle
                    }
                >

                    🔐 {words.account}

                </Text>




                <View
                    style={
                        styles.accountRow
                    }
                >


                    <Text
                        style={
                            styles.accountLabel
                        }
                    >

                        Email

                    </Text>


                    <Text
                        style={
                            styles.accountValue
                        }
                    >

                        {email}

                    </Text>


                </View>


            </View>





            {/* Logout */}


            <TouchableOpacity

                style={
                    styles.logoutButton
                }

                onPress={
                    logout
                }

                activeOpacity={0.85}

            >


                <Text
                    style={
                        styles.logoutText
                    }
                >

                    🚪 {words.logout}

                </Text>


            </TouchableOpacity>



        </ScrollView>


    );


}





/*
|--------------------------------------------------------------------------
| Stat Box
|--------------------------------------------------------------------------
*/


function StatBox({
    icon,
    value,
    label
}){


    return(


        <View
            style={
                styles.statBox
            }
        >


            <Text
                style={
                    styles.statBoxIcon
                }
            >

                {icon}

            </Text>


            <Text
                style={
                    styles.statBoxValue
                }
            >

                {value}

            </Text>


            <Text
                style={
                    styles.statBoxLabel
                }
            >

                {label}

            </Text>


        </View>


    );


}





/*
|--------------------------------------------------------------------------
| Profile Stat
|--------------------------------------------------------------------------
*/


function ProfileStat({
    icon,
    value,
    label
}){


    return(


        <View
            style={
                styles.profileStat
            }
        >


            <Text
                style={
                    styles.profileStatIcon
                }
            >

                {icon}

            </Text>


            <Text
                style={
                    styles.profileStatValue
                }
            >

                {value}

            </Text>


            <Text
                style={
                    styles.profileStatLabel
                }
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

        backgroundColor:
            "#F8FAFC"

    },


    content:{

        width:"100%",

        maxWidth:850,

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

        backgroundColor:
            "#F8FAFC"

    },


    pageHeader:{

        marginBottom:20

    },


    pageTitle:{

        fontSize:28,

        fontWeight:"800",

        color:"#14532D"

    },


    pageSubtitle:{

        marginTop:5,

        color:"#64748B",

        fontSize:14

    },


    /*
    |--------------------------------------------------------------------------
    | Profile Card
    |--------------------------------------------------------------------------
    */


    profileCard:{

        backgroundColor:"#14532D",

        borderRadius:26,

        padding:22,

        alignItems:"center",

        marginBottom:14

    },


    avatar:{

        width:82,

        height:82,

        borderRadius:41,

        backgroundColor:"#DCFCE7",

        alignItems:"center",

        justifyContent:"center",

        borderWidth:4,

        borderColor:
            "rgba(255,255,255,0.30)"

    },


    avatarText:{

        fontSize:34,

        fontWeight:"900",

        color:"#166534"

    },


    name:{

        marginTop:13,

        fontSize:23,

        fontWeight:"900",

        color:"#FFFFFF"

    },


    email:{

        marginTop:4,

        color:"#BBF7D0",

        fontSize:13

    },


    levelBadge:{

        marginTop:13,

        paddingHorizontal:13,

        paddingVertical:7,

        borderRadius:16,

        backgroundColor:
            "rgba(255,255,255,0.15)"

    },


    levelBadgeText:{

        color:"#FEF08A",

        fontWeight:"800",

        fontSize:13

    },


    xpHeader:{

        width:"100%",

        marginTop:20,

        flexDirection:"row",

        justifyContent:"space-between"

    },


    xpTitle:{

        color:"#DCFCE7",

        fontSize:11,

        fontWeight:"700"

    },


    xpValue:{

        color:"#FFFFFF",

        fontSize:11,

        fontWeight:"800"

    },


    xpBackground:{

        width:"100%",

        height:10,

        marginTop:8,

        backgroundColor:
            "rgba(255,255,255,0.20)",

        borderRadius:6,

        overflow:"hidden"

    },


    xpFill:{

        height:"100%",

        borderRadius:6,

        backgroundColor:"#FEF08A"

    },


    rewardRow:{

        width:"100%",

        marginTop:20,

        flexDirection:"row"

    },


    rewardItem:{

        flex:1,

        alignItems:"center"

    },


    rewardDivider:{

        width:1,

        backgroundColor:
            "rgba(255,255,255,0.20)"

    },


    rewardIcon:{

        fontSize:20

    },


    rewardValue:{

        marginTop:4,

        fontSize:20,

        fontWeight:"900",

        color:"#FFFFFF"

    },


    rewardLabel:{

        marginTop:2,

        color:"#BBF7D0",

        fontSize:11

    },


    /*
    |--------------------------------------------------------------------------
    | Streak
    |--------------------------------------------------------------------------
    */


    twoColumnRow:{

        flexDirection:"row",

        marginHorizontal:-5,

        marginBottom:4

    },


    statBox:{

        flex:1,

        margin:5,

        padding:17,

        backgroundColor:"#FFFFFF",

        borderWidth:1,

        borderColor:"#E2E8F0",

        borderRadius:20,

        alignItems:"center"

    },


    statBoxIcon:{

        fontSize:24

    },


    statBoxValue:{

        marginTop:7,

        fontSize:24,

        fontWeight:"900",

        color:"#14532D"

    },


    statBoxLabel:{

        marginTop:4,

        fontSize:11,

        color:"#64748B",

        textAlign:"center"

    },


    /*
    |--------------------------------------------------------------------------
    | Sections
    |--------------------------------------------------------------------------
    */


    sectionCard:{

        backgroundColor:"#FFFFFF",

        borderRadius:21,

        padding:17,

        marginTop:12,

        borderWidth:1,

        borderColor:"#E2E8F0"

    },


    sectionTitle:{

        fontSize:16,

        fontWeight:"800",

        color:"#0F172A",

        marginBottom:14

    },


    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */


    statsGrid:{

        flexDirection:"row",

        flexWrap:"wrap",

        marginHorizontal:-4

    },


    profileStat:{

        width:"47%",

        flexGrow:1,

        backgroundColor:"#F8FAFC",

        margin:4,

        borderRadius:15,

        padding:14,

        alignItems:"center"

    },


    profileStatIcon:{

        fontSize:20

    },


    profileStatValue:{

        marginTop:5,

        fontSize:20,

        fontWeight:"900",

        color:"#14532D"

    },


    profileStatLabel:{

        marginTop:4,

        color:"#64748B",

        fontSize:10,

        textAlign:"center"

    },


    achievementButton:{

        marginTop:13,

        backgroundColor:"#F0FDF4",

        borderRadius:14,

        paddingHorizontal:14,

        paddingVertical:13,

        flexDirection:"row",

        alignItems:"center",

        justifyContent:"space-between"

    },


    achievementButtonText:{

        color:"#15803D",

        fontWeight:"800",

        fontSize:13

    },


    rowArrow:{

        fontSize:25,

        color:"#16A34A",

        fontWeight:"700"

    },


    /*
    |--------------------------------------------------------------------------
    | Language
    |--------------------------------------------------------------------------
    */


    languageRow:{

        flexDirection:"row",

        backgroundColor:"#F1F5F9",

        borderRadius:15,

        padding:4

    },


    languageButton:{

        flex:1,

        paddingVertical:12,

        borderRadius:12,

        alignItems:"center"

    },


    languageActive:{

        backgroundColor:"#16A34A"

    },


    languageText:{

        fontSize:13,

        fontWeight:"800",

        color:"#64748B"

    },


    languageActiveText:{

        color:"#FFFFFF"

    },


    /*
    |--------------------------------------------------------------------------
    | Settings
    |--------------------------------------------------------------------------
    */


    settingsRow:{

        flexDirection:"row",

        justifyContent:"space-between",

        alignItems:"center"

    },


    settingsLeft:{

        flex:1,

        flexDirection:"row",

        alignItems:"center"

    },


    settingsIconBox:{

        width:44,

        height:44,

        borderRadius:14,

        backgroundColor:"#F0FDF4",

        alignItems:"center",

        justifyContent:"center",

        marginRight:12

    },


    settingsIcon:{

        fontSize:20

    },


    settingsTitle:{

        fontSize:14,

        fontWeight:"800",

        color:"#334155"

    },


    settingsDescription:{

        fontSize:11,

        color:"#94A3B8",

        marginTop:3

    },


    /*
    |--------------------------------------------------------------------------
    | Account
    |--------------------------------------------------------------------------
    */


    accountRow:{

        flexDirection:"row",

        justifyContent:"space-between",

        alignItems:"center"

    },


    accountLabel:{

        color:"#64748B",

        fontSize:13

    },


    accountValue:{

        flex:1,

        marginLeft:15,

        color:"#334155",

        fontSize:12,

        fontWeight:"700",

        textAlign:"right"

    },


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */


    logoutButton:{

        marginTop:20,

        minHeight:54,

        borderRadius:17,

        backgroundColor:"#FEE2E2",

        borderWidth:1,

        borderColor:"#FECACA",

        justifyContent:"center",

        alignItems:"center"

    },


    logoutText:{

        color:"#DC2626",

        fontWeight:"900",

        fontSize:15

    }


});