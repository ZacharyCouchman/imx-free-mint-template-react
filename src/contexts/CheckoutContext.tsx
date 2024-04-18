import { checkout } from "@imtbl/sdk";
import {
  BridgeEventType,
  ConnectEventType,
  OnRampEventType,
  SwapEventType,
  WalletEventType,
  Widget,
  WidgetTheme,
  WidgetType
} from "@imtbl/sdk/checkout";
import { ReactNode, createContext, useEffect, useState } from "react";

export interface Widgets {
  connect?: Widget<WidgetType.CONNECT>;
  wallet?: Widget<WidgetType.WALLET>;
  swap?: Widget<WidgetType.SWAP>;
  bridge?: Widget<WidgetType.BRIDGE>;
  onramp?: Widget<WidgetType.ONRAMP>;
}

export interface CheckoutContextState {
  checkout?: checkout.Checkout;
  widgets: Widgets;
  widgetsFactory?: ImmutableCheckoutWidgets.WidgetsFactory;
}

export const CheckoutContext = createContext<CheckoutContextState>({
  widgets: {
    connect: undefined,
    wallet: undefined,
    swap: undefined,
    bridge: undefined,
    onramp: undefined,
  }
});

export interface CheckoutProvider {
  children: ReactNode;
  checkout: checkout.Checkout;
}
export function CheckoutProvider({ children, checkout }: CheckoutProvider) {
  const [widgetsFactory, setWidgetsFactory] = useState<ImmutableCheckoutWidgets.WidgetsFactory>();
  const [widgets, setWidgets] = useState<Widgets>({});

  useEffect(() => {
    // Initialise widgets and create all widgets at beginning of application

    checkout.widgets({ config: { theme: WidgetTheme.DARK } })
      .then((widgetsFactory: ImmutableCheckoutWidgets.WidgetsFactory) => {
        const connect = widgetsFactory.create(WidgetType.CONNECT, {});
        connect.addListener(ConnectEventType.CLOSE_WIDGET, () => connect.unmount())

        const wallet = widgetsFactory.create(WidgetType.WALLET, {});
        wallet.addListener(WalletEventType.CLOSE_WIDGET, () => wallet.unmount())

        const swap = widgetsFactory.create(WidgetType.SWAP, {});
        swap.addListener(SwapEventType.CLOSE_WIDGET, () => swap.unmount())

        const bridge = widgetsFactory.create(WidgetType.BRIDGE, {});
        bridge.addListener(BridgeEventType.CLOSE_WIDGET, () => bridge.unmount())

        const onramp = widgetsFactory.create(WidgetType.ONRAMP, {});
        onramp.addListener(OnRampEventType.CLOSE_WIDGET, () => onramp.unmount())

        setWidgets({
          connect,
          wallet,
          swap,
          bridge,
          onramp
        })
        setWidgetsFactory(widgetsFactory)
      })
  }, [checkout]);

  return (
    <CheckoutContext.Provider value= {{
      checkout,
      widgets,
      widgetsFactory
    }}>
      {children}
  </CheckoutContext.Provider>
  )
}