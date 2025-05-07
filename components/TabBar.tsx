// import React from "react";
// import { StyleSheet, View } from "react-native";
// import { Text } from "react-native-paper";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// // Custom color theme
// const theme = {
//   primary: "#1e824c",
//   primaryDark: "#145c36",
//   primaryLight: "#4caf7d",
//   inactive: "#757575",
//   background: "#ffffff",
//   text: "#333333",
//   border: "#e0e0e0",
// };

// const TabBar = ({ tabs, activeIndex, onTabPress }) => {
//   return (
//     <View style={styles.container}>
//       {tabs.map((tab, index) => (
//         <View
//           key={tab.key}
//           style={styles.tabItem}
//           onTouchEnd={() => onTabPress(index)}
//         >
//           <MaterialCommunityIcons
//             name={tab.icon}
//             size={24}
//             color={activeIndex === index ? theme.primary : theme.inactive}
//             style={styles.icon}
//           />
//           <Text
//             numberOfLines={1}
//             style={[
//               styles.label,
//               {
//                 color: activeIndex === index ? theme.primary : theme.inactive,
//               },
//               activeIndex === index && styles.activeLabel,
//             ]}
//           >
//             {tab.title}
//           </Text>
//         </View>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     height: 70,
//     backgroundColor: theme.background,
//     borderTopWidth: 1,
//     borderTopColor: theme.border,
//   },
//   tabItem: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingTop: 8,
//     paddingBottom: 10,
//   },
//   label: {
//     fontSize: 12,
//     marginTop: 4,
//     textAlign: "center",
//     includeFontPadding: false,
//     height: 16,
//   },
//   activeLabel: {
//     fontWeight: "600",
//   },
//   icon: {
//     marginBottom: 2,
//   },
// });

// export default TabBar;
