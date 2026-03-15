'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { tripStore } from '@/lib/store/trip-store';
import type { Destination, TripDetails, AIRecommendation } from '@/lib/types';

export function useTrip() {
  const state = useSyncExternalStore(
    tripStore.subscribe.bind(tripStore),
    () => tripStore.getState(),
    () => tripStore.getState()
  );

  const addDestination = useCallback((destination: Destination, travelers?: number) => {
    tripStore.addDestination(destination, travelers);
  }, []);

  const removeDestination = useCallback((destinationId: string) => {
    tripStore.removeDestination(destinationId);
  }, []);

  const updateDestinationOrder = useCallback((destinationId: string, newOrder: number) => {
    tripStore.updateDestinationOrder(destinationId, newOrder);
  }, []);

  const updateDestinationDate = useCallback((destinationId: string, date: Date) => {
    tripStore.updateDestinationDate(destinationId, date);
  }, []);

  const setTripDetails = useCallback((details: TripDetails) => {
    tripStore.setTripDetails(details);
  }, []);

  const setCurrentStep = useCallback((step: 'destinations' | 'details' | 'review') => {
    tripStore.setCurrentStep(step);
  }, []);

  const clearTrip = useCallback(() => {
    tripStore.clearTrip();
  }, []);

  const isDestinationSelected = useCallback((destinationId: string): boolean => {
    return state.selectedDestinations.some(sd => sd.destination.id === destinationId);
  }, [state.selectedDestinations]);

  const totalPrice = tripStore.getTotalPrice();

  return {
    selectedDestinations: state.selectedDestinations,
    tripDetails: state.tripDetails,
    aiRecommendations: state.aiRecommendations,
    currentStep: state.currentStep,
    isLoading: state.isLoading,
    totalPrice,
    addDestination,
    removeDestination,
    updateDestinationOrder,
    updateDestinationDate,
    setTripDetails,
    setCurrentStep,
    clearTrip,
    isDestinationSelected,
  };
}
