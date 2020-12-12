import React from 'react';
import { dataType, IPhotoProviderBase, ReachTypeEnum } from './types';
import './PhotoSlider.less';
export interface IPhotoSliderProps extends IPhotoProviderBase {
    images: dataType[];
    index?: number;
    visible: boolean;
    onClose: (evt?: React.MouseEvent | React.TouchEvent) => void;
    onIndexChange?: Function;
}
declare type PhotoSliderState = {
    translateX: number;
    photoIndex: number;
    touched: boolean;
    shouldTransition: boolean;
    lastClientX: number | undefined;
    lastClientY: number | undefined;
    backdropOpacity: number;
    lastBackdropOpacity: number;
    overlayVisible: boolean;
    canPullClose: boolean;
    rotatingMap: Map<number, number>;
};
export default class PhotoSlider extends React.Component<IPhotoSliderProps, PhotoSliderState> {
    static displayName: string;
    static defaultProps: {
        maskClosable: boolean;
        photoClosable: boolean;
        bannerVisible: boolean;
        introVisible: boolean;
    };
    static getDerivedStateFromProps(nextProps: any, prevState: any): {
        photoIndex: any;
        translateX: number;
    } | null;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleClose: (evt?: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element> | undefined) => void;
    handlePhotoTap: () => void;
    handlePhotoMaskTap: () => void;
    handleResize: () => void;
    handleRotate: (rotating: number) => void;
    handleKeyDown: (evt: KeyboardEvent) => void;
    handleBack: (evt: KeyboardEvent) => void;
    handleReachVerticalMove: (clientY: any, scale: any) => void;
    handleReachHorizontalMove: (clientX: any) => void;
    handleIndexChange: (photoIndex: number, shouldTransition?: boolean) => void;
    handlePrevious: (shouldTransition?: boolean | undefined) => void;
    handleNext: (shouldTransition?: boolean | undefined) => void;
    handleReachMove: (reachState: ReachTypeEnum, clientX: number, clientY: number, scale?: number | undefined) => void;
    handleReachUp: (clientX: number, clientY: number) => void;
    render(): JSX.Element;
}
export {};
