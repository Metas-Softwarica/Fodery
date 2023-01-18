import React from "react";

import CategoryLight from "../../assets/icons/svgs/category_light.svg";
import CategoryLightActive from "../../assets/icons/svgs/category_light_active.svg";
import HeartLight from "../../assets/icons/svgs/heart_light.svg";
import HeartLightActive from "../../assets/icons/svgs/heart_light_active.svg";
import HomeLight from "../../assets/icons/svgs/home_light.svg";
import HomeLightActive from "../../assets/icons/svgs/home_light_active.svg";
import ScooterLight from "../../assets/icons/svgs/scooter_light.svg";
import ScooterLightActive from "../../assets/icons/svgs/scooter_light_active.svg";
import PlusLight from "../../assets/icons/svgs/plus_light.svg";
import PlusLightActive from "../../assets/icons/svgs/plus_light_active.svg";

import CategoryDark from "../../assets/icons/svgs/category_dark.svg";
import CategoryDarkActive from "../../assets/icons/svgs/category_dark_active.svg";
import HeartDark from "../../assets/icons/svgs/heart_dark.svg";
import HeartDarkActive from "../../assets/icons/svgs/heart_dark_active.svg";
import HomeDark from "../../assets/icons/svgs/home_dark.svg";
import HomeDarkActive from "../../assets/icons/svgs/home_dark_active.svg";
import ScooterDark from "../../assets/icons/svgs/scooter_dark.svg";
import ScooterDarkActive from "../../assets/icons/svgs/scooter_dark_active.svg";
import PlusDark from "../../assets/icons/svgs/plus_dark.svg";
import PlusDarkActive from "../../assets/icons/svgs/plus_dark_active.svg";
import PlusDarkBlackShade from "../../assets/icons/svgs/plus_dark_black_shade.svg";
import AddToCartPlusGreyShade from "../../assets/icons/svgs/add_to_cart_plus_grey_shade.svg";
import AddToCartPlusWhiteShade from "../../assets/icons/svgs/add_to_cart_plus_white_shade.svg";

import CheckDarkGreen from "../../assets/icons/svgs/check_dark_green.svg";
import EditDark from "../../assets/icons/svgs/edit_black.svg";
import DeleteDark from "../../assets/icons/svgs/delete_black.svg";

import Edit from "../../assets/icons/svgs/edit.svg";
import Delete from "../../assets/icons/svgs/delete.svg";
import Checkmark from "../../assets/icons/svgs/checkmark.svg";
import Option from "../../assets/icons/svgs/option.svg";
import Plus from "../../assets/icons/svgs/plus.svg";

import SearchIcon from "../../assets/icons/svgs/Search.svg";
import BagIcon from "../../assets/icons/svgs/Bag.svg";

import CoinIcon from "../../assets/icons/svgs/coin_icon.svg";


function Icon({ name, size = 20, ...props }) {

    switch (name) {
        // Light Icons
        case "category_light":
            return <CategoryLight width={size} height={size} {...props} />
        case "category_light_active":
            return <CategoryLightActive width={size} height={size} {...props} />
        case "heart_light":
            return <HeartLight width={size} height={size} {...props} />
        case "heart_light_active":
            return <HeartLightActive width={size} height={size} {...props} />
        case "home_light":
            return <HomeLight width={size} height={size} {...props} />
        case "home_light_active":
            return <HomeLightActive width={size} height={size} {...props} />
        case "scooter_light":
            return <ScooterLight width={size} height={size} {...props} />
        case "scooter_light_active":
            return <ScooterLightActive width={size} height={size} {...props} />
        case "plus_light":
            return <PlusLight width={size} height={size} {...props} />
        case "plus_light_active":
            return <PlusLightActive width={size} height={size} {...props} />
        case "add_to_cart_plus_white_shade":
            return <AddToCartPlusWhiteShade width={size} height={size} {...props} />
        case "add_to_cart_plus_grey_shade":
            return <AddToCartPlusGreyShade width={size} height={size} {...props} />

        // Dark Icons
        case "category_dark":
            return <CategoryDark width={size} height={size} {...props} />
        case "category_dark_active":
            return <CategoryDarkActive width={size} height={size} {...props} />
        case "heart_dark":
            return <HeartDark width={size} height={size} {...props} />
        case "heart_dark_active":
            return <HeartDarkActive width={size} height={size} {...props} />
        case "home_dark":
            return <HomeDark width={size} height={size} {...props} />
        case "home_dark_active":
            return <HomeDarkActive width={size} height={size} {...props} />
        case "scooter_dark":
            return <ScooterDark width={size} height={size} {...props} />
        case "scooter_dark_active":
            return <ScooterDarkActive width={size} height={size} {...props} />
        case "plus_dark":
            return <PlusDark width={size} height={size} {...props} />
        case "plus_dark_active":
            return <PlusDarkActive width={size} height={size} {...props} />
        case "plus_dark_black_shade":
            return <PlusDarkBlackShade width={size} height={size} {...props} />


        // other icons
        case "check_dark_green":
            return <CheckDarkGreen width={size} height={size} {...props} />
        case "edit_dark":
            return <EditDark width={size} height={size} {...props} />
        case "delete_dark":
            return <DeleteDark width={size} height={size} {...props} />
        case "checkmark":
            return <Checkmark width={size} height={size} {...props} />
        case "edit":
            return <Edit width={size} height={size} {...props} />
        case "delete":
            return <Delete width={size} height={size} {...props} />
        case "option":
            return <Option width={size} height={size} {...props} />
        case "plus":
            return <Plus width={size} height={size} {...props} />
        case "search":
            return <SearchIcon width={size} height={size} {...props} />
        case "bag":
            return <BagIcon width={size} height={size} {...props} />
        case "coin":
            return <CoinIcon width={size} height={size} {...props} />

        default:
            return <></>
    }
};

export default Icon;