
import DietSettings from "@/components/cattle/DietSettings";
import { CattlInfo } from "@/views/addCattle/CattleInfo";
import { Diet } from "@/views/addCattle/Diet";
import DietFeed from "@/views/addCattle/DietFeed";
import Medication from "@/views/addCattle/Medication";
import { Medications } from "@/views/addCattle/Medications";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

export type AddCattleStackParams = {
	CattleInfo: undefined;
	Diet: undefined;
	DietSettings: undefined;
	DietFeed: {
		dietFeedId: string;
		modify: boolean;
	}
	| undefined;
	Medications: undefined;
	Medication: undefined;
}

const Stack = createStackNavigator<AddCattleStackParams>();
const AddCattleStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="CattleInfo"
				component={CattlInfo}
			/>
			<Stack.Screen
				name="Diet"
				component={Diet}
			/>

			<Stack.Screen
				name="Medications"
				component={Medications}
			/>

			<Stack.Screen
				name="DietFeed"
				component={DietFeed}
				options={{
					presentation: "modal",
				}}
			/>

			<Stack.Screen
				name="DietSettings"
				options={{
					presentation: "modal",
				}}
				component={DietSettings}
			/>

			<Stack.Screen
				name="Medication"
				options={{
					presentation: "modal",
				}}
				component={Medication}
			/>

		</Stack.Navigator>
	);
};

export default AddCattleStack;