import React from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

const {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
} = Dimensions.get('window')

const MIN_TRANSLATE_X = 0
const MAX_TRANSLATE_X = SCREEN_WIDTH * .95

const MIN_TRANSLATE_Y = -30;
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 24;

export const PanelPan = (props) => {

    const { position, children } = props

    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const context = useSharedValue({ x: 0, y: 0 })

    const [barStyle, setBarStyle] = React.useState('')

    const scrollTo = React.useCallback((destination) => {
        "worklet"
        translateX.value = withSpring(destination)
        translateY.value = withSpring(destination)
    }, [])

    const gesture = Gesture.Pan()
        .onStart(() => context.value = { x: translateX.value, y: translateY.value })
        .onUpdate(e => {
            switch (position) {
                case 'BOTTOM':
                    translateY.value = e.translationY + context.value.y
                    translateY.value = Math.min(translateY.value, MIN_TRANSLATE_Y)
                    translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y)
                    break;
                case 'LEFT':
                    translateX.value = e.translationX + context.value.x
                    translateX.value = Math.min(translateX.value, MAX_TRANSLATE_X)
                    translateX.value = Math.max(translateX.value, MIN_TRANSLATE_X)
                    break;
                case 'RIGHT':
                    translateX.value = e.translationX + context.value.x
                    translateX.value = Math.min(translateX.value, MIN_TRANSLATE_X)
                    translateX.value = Math.max(translateX.value, -MAX_TRANSLATE_X)
                    break;
                default:
                    break;
            }
            // console.log(translateX.value)
        })
        .onEnd(() => {
            switch (position) {
                case 'BOTTOM':
                    translateY.value > -SCREEN_HEIGHT / 2 ?
                        scrollTo(MIN_TRANSLATE_Y)
                        :
                        scrollTo(MAX_TRANSLATE_Y)
                    break;
                case 'LEFT':
                    translateX.value > SCREEN_WIDTH / 2 ?
                        scrollTo(MAX_TRANSLATE_X)
                        :
                        scrollTo(MIN_TRANSLATE_X)
                    break;
                case 'RIGHT':
                    translateX.value < -SCREEN_WIDTH / 2 ?
                        scrollTo(-MAX_TRANSLATE_X)
                        :
                        scrollTo(MIN_TRANSLATE_X)
                    break;
                default:
                    break;
            }

        })

    const slider = useAnimatedStyle(() => {
        switch (position) {
            case 'BOTTOM':
                return { transform: [{ translateY: translateY.value }] }
            case 'LEFT':
                return { transform: [{ translateX: translateX.value }] }
            case 'RIGHT':
                return { transform: [{ translateX: translateX.value }] }
            default:
                break;
        }
    })

    React.useEffect(() => {
        switch (position) {
            case 'BOTTOM':
                scrollTo(MIN_TRANSLATE_Y)
                setBarStyle('lineH')
                break;
            case 'LEFT':
                scrollTo(MIN_TRANSLATE_X)
                setBarStyle('lineV')
                break;
            case 'RIGHT':
                scrollTo(MIN_TRANSLATE_X)
                setBarStyle('lineV')
                break;
            default:
                break;
        }
    }, [position])

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles[position.toLowerCase()], slider]}>
                <View style={[styles[barStyle]]} />
                {children}
            </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    bottom: {
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        position: 'absolute',
        height: SCREEN_HEIGHT,
        backgroundColor: 'white',
        top: SCREEN_HEIGHT,
        flexDirection: "column"
    },
    left: {
        top: 24,
        width: SCREEN_WIDTH,
        position: "absolute",
        height: SCREEN_HEIGHT - 24,
        backgroundColor: 'white',
        right: SCREEN_WIDTH * .95,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        flexDirection: 'row-reverse'
    },
    right: {
        top: 24,
        width: SCREEN_WIDTH,
        position: "absolute",
        height: SCREEN_HEIGHT - 24,
        backgroundColor: 'white',
        left: SCREEN_WIDTH * .95,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        flexDirection: 'row'
    },
    lineH: {
        width: 75,
        height: 4,
        backgroundColor: '#555',
        alignSelf: "center",
        marginVertical: 15,
        borderRadius: 2
    },
    lineV: {
        width: 4,
        height: 75,
        borderRadius: 2,
        marginHorizontal: 10,
        backgroundColor: '#555',
        marginVertical: SCREEN_HEIGHT / 2 - 75 / 2,
        alignSelf: 'flex-end'
    }
})