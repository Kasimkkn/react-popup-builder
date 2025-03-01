
import React from "react";
import { usePopup } from "@/contexts/PopupContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import {
  PopupPosition,
  PopupAnimation,
  TriggerType,
  CloseButtonPosition
} from "@/types/popup";

const GeneralSettings: React.FC = () => {
  const { currentTemplate, updateCurrentTemplate } = usePopup();

  const {
    popupStyles,
    overlayStyles,
    trigger,
    animation,
    closeButton
  } = currentTemplate;

  const positions: { value: PopupPosition; label: string }[] = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'center-left', label: 'Center Left' },
    { value: 'center', label: 'Center' },
    { value: 'center-right', label: 'Center Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' },
  ];

  const animations: { value: PopupAnimation; label: string }[] = [
    { value: 'fade-in', label: 'Fade In' },
    { value: 'scale-in', label: 'Scale In' },
    { value: 'slide-in-top', label: 'Slide In (Top)' },
    { value: 'slide-in-right', label: 'Slide In (Right)' },
    { value: 'slide-in-bottom', label: 'Slide In (Bottom)' },
    { value: 'slide-in-left', label: 'Slide In (Left)' },
    { value: 'none', label: 'None' },
  ];

  const triggers: { value: TriggerType; label: string }[] = [
    { value: 'onLoad', label: 'On Page Load' },
    { value: 'onDelay', label: 'After Delay' },
    { value: 'onClick', label: 'On Click (Element ID)' },
  ];

  const closePositions: { value: CloseButtonPosition; label: string }[] = [
    { value: 'inside', label: 'Inside Popup' },
    { value: 'outside', label: 'Outside Popup' },
    { value: 'none', label: 'No Close Button' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Popup Settings</h2>

        <div className="space-y-2">
          <Label htmlFor="popup-name">Popup Name</Label>
          <Input
            id="popup-name"
            value={currentTemplate.name}
            onChange={(e) => updateCurrentTemplate({ name: e.target.value })}
            placeholder="My Awesome Popup"
          />
        </div>


        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="appearance">
            <AccordionTrigger>Popup Appearance</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="popup-width">Width</Label>
                    <Input
                      id="popup-width"
                      value={popupStyles.width || ''}
                      onChange={(e) => updateCurrentTemplate({
                        popupStyles: { ...popupStyles, width: e.target.value }
                      })}
                      placeholder="400px"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="popup-height">Height</Label>
                    <Input
                      id="popup-height"
                      value={popupStyles.height || ''}
                      onChange={(e) => updateCurrentTemplate({
                        popupStyles: { ...popupStyles, height: e.target.value }
                      })}
                      placeholder="auto"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="popup-bg">Background Color</Label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded border overflow-hidden">
                      <input
                        type="color"
                        id="popup-bg"
                        value={popupStyles.background || '#ffffff'}
                        onChange={(e) => updateCurrentTemplate({
                          popupStyles: { ...popupStyles, background: e.target.value }
                        })}
                        className="w-10 h-10 -ml-1 -mt-1"
                      />
                    </div>
                    <Input
                      value={popupStyles.background || ''}
                      onChange={(e) => updateCurrentTemplate({
                        popupStyles: { ...popupStyles, background: e.target.value }
                      })}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="popup-border">Border</Label>
                  <Input
                    id="popup-border"
                    value={popupStyles.border || ''}
                    onChange={(e) => updateCurrentTemplate({
                      popupStyles: { ...popupStyles, border: e.target.value }
                    })}
                    placeholder="1px solid #e2e8f0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="popup-radius">Border Radius</Label>
                  <Input
                    id="popup-radius"
                    value={popupStyles.borderRadius || ''}
                    onChange={(e) => updateCurrentTemplate({
                      popupStyles: { ...popupStyles, borderRadius: e.target.value }
                    })}
                    placeholder="8px"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="popup-padding">Padding</Label>
                  <Input
                    id="popup-padding"
                    value={popupStyles.padding || ''}
                    onChange={(e) => updateCurrentTemplate({
                      popupStyles: { ...popupStyles, padding: e.target.value }
                    })}
                    placeholder="24px"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="popup-shadow">Box Shadow</Label>
                  <Input
                    id="popup-shadow"
                    value={popupStyles.boxShadow || ''}
                    onChange={(e) => updateCurrentTemplate({
                      popupStyles: { ...popupStyles, boxShadow: e.target.value }
                    })}
                    placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="overlay">
            <AccordionTrigger>Overlay Settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="overlay-bg">Background Color</Label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded border overflow-hidden">
                      <input
                        type="color"
                        id="overlay-bg"
                        value={overlayStyles.background || '#000000'}
                        onChange={(e) => {
                          // Convert to rgba if it's a hex color
                          const hex = e.target.value;
                          const r = parseInt(hex.slice(1, 3), 16);
                          const g = parseInt(hex.slice(3, 5), 16);
                          const b = parseInt(hex.slice(5, 7), 16);
                          const rgba = `rgba(${r}, ${g}, ${b}, ${parseFloat(overlayStyles.opacity || '0.5')})`;

                          updateCurrentTemplate({
                            overlayStyles: { ...overlayStyles, background: rgba }
                          });
                        }}
                        className="w-10 h-10 -ml-1 -mt-1"
                      />
                    </div>
                    <Input
                      value={overlayStyles.background || ''}
                      onChange={(e) => updateCurrentTemplate({
                        overlayStyles: { ...overlayStyles, background: e.target.value }
                      })}
                      placeholder="rgba(0, 0, 0, 0.5)"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overlay-opacity">Opacity</Label>
                  <Input
                    id="overlay-opacity"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={overlayStyles.opacity || '1'}
                    onChange={(e) => updateCurrentTemplate({
                      overlayStyles: { ...overlayStyles, opacity: e.target.value }
                    })}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="position">
            <AccordionTrigger>Position Settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={popupStyles.position}
                    onValueChange={(value) => updateCurrentTemplate({
                      popupStyles: { ...popupStyles, position: value as PopupPosition }
                    })}
                  >
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="animation">
            <AccordionTrigger>Animation Settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">

                <div className="space-y-2">
                  <Label htmlFor="animation">Animation</Label>
                  <Select
                    value={animation}
                    onValueChange={(value) => updateCurrentTemplate({
                      animation: value as PopupAnimation
                    })}
                  >
                    <SelectTrigger id="animation">
                      <SelectValue placeholder="Select animation" />
                    </SelectTrigger>
                    <SelectContent>
                      {animations.map((anim) => (
                        <SelectItem key={anim.value} value={anim.value}>
                          {anim.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="close-button">
            <AccordionTrigger>Close Button Settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <h3 className="text-md font-medium mb-3">Close Button</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="close-button-enabled">Enable Close Button</Label>
                      <Switch
                        id="close-button-enabled"
                        checked={closeButton.enabled}
                        onCheckedChange={(checked) => updateCurrentTemplate({
                          closeButton: { ...closeButton, enabled: checked }
                        })}
                      />
                    </div>

                    {closeButton.enabled && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="close-position">Position</Label>
                          <Select
                            value={closeButton.position}
                            onValueChange={(value) => updateCurrentTemplate({
                              closeButton: { ...closeButton, position: value as CloseButtonPosition }
                            })}
                          >
                            <SelectTrigger id="close-position">
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                              {closePositions.map((pos) => (
                                <SelectItem key={pos.value} value={pos.value}>
                                  {pos.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="close-color">Close Button Color</Label>
                          <div className="flex gap-2">
                            <div className="w-8 h-8 rounded border overflow-hidden">
                              <input
                                type="color"
                                id="close-color"
                                value={closeButton.styles.textColor || '#000000'}
                                onChange={(e) => updateCurrentTemplate({
                                  closeButton: {
                                    ...closeButton,
                                    styles: { ...closeButton.styles, textColor: e.target.value }
                                  }
                                })}
                                className="w-10 h-10 -ml-1 -mt-1"
                              />
                            </div>
                            <Input
                              value={closeButton.styles.textColor || ''}
                              onChange={(e) => updateCurrentTemplate({
                                closeButton: {
                                  ...closeButton,
                                  styles: { ...closeButton.styles, textColor: e.target.value }
                                }
                              })}
                              placeholder="#000000"
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="triggerType">
            <AccordionTrigger>Trigger Type Settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <h3 className="text-md font-medium mb-3">Trigger</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="trigger-type">Trigger Type</Label>
                      <Select
                        value={trigger.type}
                        onValueChange={(value) => updateCurrentTemplate({
                          trigger: { ...trigger, type: value as TriggerType }
                        })}
                      >
                        <SelectTrigger id="trigger-type">
                          <SelectValue placeholder="Select trigger type" />
                        </SelectTrigger>
                        <SelectContent>
                          {triggers.map((trig) => (
                            <SelectItem key={trig.value} value={trig.value}>
                              {trig.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {trigger.type === 'onDelay' && (
                      <div className="space-y-2">
                        <Label htmlFor="delay-seconds">Delay (seconds)</Label>
                        <Input
                          id="delay-seconds"
                          type="number"
                          min="0"
                          value={trigger.delay || '0'}
                          onChange={(e) => updateCurrentTemplate({
                            trigger: { ...trigger, delay: e.target.value }
                          })}
                        />
                      </div>
                    )}

                    {trigger.type === 'onClick' && (
                      <div className="space-y-2">
                        <Label htmlFor="trigger-element">Element ID</Label>
                        <Input
                          id="trigger-element"
                          value={trigger.elementId || ''}
                          onChange={(e) => updateCurrentTemplate({
                            trigger: { ...trigger, elementId: e.target.value }
                          })}
                          placeholder="button-id"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default GeneralSettings;
