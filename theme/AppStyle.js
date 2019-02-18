import Fonts from './Fonts';
import Metrics from './Metrics';
import Colors from './Colors';

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const AppStyle = {
  screen: {
    safeArea: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: 92,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    containerDark: {
      flex: 1,
      backgroundColor: Colors.backgroundDark,
    },
    containerAlternate: {
      flex: 1,
      backgroundColor: Colors.primary,
    },
    margin: {
      marginLeft: Metrics.marginHorizontal,
      marginRight: Metrics.marginHorizontal,
      marginTop: Metrics.marginVertical,
      marginBottom: Metrics.marginVertical,
    },
    padding: {
      padding: Metrics.padding,
    },
    paddingHorizontal: {
      paddingLeft: Metrics.padding,
      paddingRight: Metrics.padding,
    },
    marginHorizontal: {
      marginLeft: Metrics.marginHorizontal,
      marginRight: Metrics.marginHorizontal,
    },
    marginVertical: {
      marginTop: Metrics.marginVertical,
      marginBottom: Metrics.marginVertical,
    },
    marginVerticalDouble: {
      marginTop: Metrics.marginVertical * 2,
      marginBottom: Metrics.marginVertical * 4,
    },
    marginBottom: {
      marginBottom: Metrics.marginVertical * 2,
    },

    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },

    sectionText: {
      ...Fonts.style.normal,
      paddingVertical: Metrics.doubleBaseMargin,
      color: Colors.coal,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center',
    },
    subtitle: {
      color: Colors.coal,
      padding: Metrics.smallMargin,
      marginBottom: Metrics.smallMargin,
      marginHorizontal: Metrics.smallMargin,
      textAlign: 'center',
    },
    titleText: {
      ...Fonts.style.h2,
      fontSize: 24,
      color: Colors.coal,
      textAlign: 'center',
    },
  },
  form: {
    flex: 1,
    textArea: {
      height: 100,
    },
    search: {
      backgroundColor: Colors.card,
      borderBottomWidth: 2,
      borderBottomColor: Colors.divider,
      paddingVertical: 10,
      paddingHorizontal: 20,
      height: 60,
      ...Fonts.style.input,
    },
  },
  flex: {
    flexRow: {
      flexDirection: 'row',
    },
    flexColumn: {
      flexDirection: 'column',
    },
    flexWrap: {
      flexWrap: 'wrap',
    },
  },
  helpers: {
    divider: {
      borderBottomWidth: 1,
      borderColor: Colors.divider,
      marginBottom: 15,
    },
    fill: {
      flex: 1,
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerVertical: {
      alignItems: 'center',
    },
    centerSelf: {
      alignSelf: 'center',
    },
    bottom: {
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    start: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    end: {
      justifyContent: 'flex-end',
    },
    shadow: {
      shadowColor: Colors.shadow,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    },
  },
};

export default AppStyle;
